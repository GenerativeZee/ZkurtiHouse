import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { orderData } = await req.json();
    const { userId } = await auth();
    const orderNumber = `LN-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clerkUserId: userId ?? null,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        subtotal: orderData.subtotal,
        discount: orderData.discount ?? 0,
        couponCode: orderData.couponCode ?? null,
        total: orderData.total,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "confirmed",
        items: {
          create: orderData.items.map((item: {
            productId: string; name: string; price: number;
            imageUrl: string; quantity: number; size: string; color: string;
          }) => ({
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
    });

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("save-order error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
