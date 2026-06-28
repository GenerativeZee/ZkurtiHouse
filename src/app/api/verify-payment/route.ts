import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await req.json();

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Save confirmed order to database
    const orderNumber = `LN-${Date.now().toString(36).toUpperCase()}`;

    const { data, error } = await getSupabaseAdmin()
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        discount: orderData.discount ?? 0,
        coupon_code: orderData.couponCode ?? null,
        total: orderData.total,
        payment_method: "online",
        payment_status: "paid",
        razorpay_order_id,
        razorpay_payment_id,
        status: "confirmed",
      })
      .select("id, order_number")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id, orderNumber: data.order_number });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
