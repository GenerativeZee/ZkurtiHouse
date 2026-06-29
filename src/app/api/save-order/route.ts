import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { OrderDataSchema } from "@/lib/validation";
import { logger } from "@/lib/logger";
import { sendOrderConfirmation } from "@/lib/email";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const { orderData } = await req.json();

    // Validate order payload
    let validatedData;
    try {
      validatedData = OrderDataSchema.parse(orderData);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json({ error: "Invalid order data", details: err.issues }, { status: 400 });
      }
      throw err;
    }

    // Verify prices and stock against database
    const productIds = validatedData.items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, stock: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));
    for (const item of validatedData.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      if (product.price !== item.price) {
        return NextResponse.json(
          { error: `Price mismatch for "${product.name}". Please refresh and try again.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}": only ${product.stock} left.` },
          { status: 400 }
        );
      }
    }

    const { userId } = await auth();
    const orderNumber = `LN-${Date.now().toString(36).toUpperCase()}`;

    // Atomic: create order + decrement stock in one transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          clerkUserId: userId ?? null,
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          shippingAddress: validatedData.shippingAddress,
          subtotal: validatedData.subtotal,
          discount: validatedData.discount ?? 0,
          couponCode: validatedData.couponCode ?? null,
          total: validatedData.total,
          paymentMethod: "cod",
          paymentStatus: "pending",
          status: "confirmed",
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    logger.info("Order created (COD)", { orderNumber, total: validatedData.total });

    await sendOrderConfirmation({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      createdAt: order.createdAt,
      shippingAddress: validatedData.shippingAddress,
      items: order.items,
    });

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (err) {
    logger.error("save-order error", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
