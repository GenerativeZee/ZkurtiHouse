import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await req.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

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
        paymentMethod: "online",
        paymentStatus: "paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
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
    console.error("verify-payment error:", err);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
