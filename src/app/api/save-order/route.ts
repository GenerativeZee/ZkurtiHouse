import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Used for Cash on Delivery orders (no Razorpay verification needed)
export async function POST(req: Request) {
  try {
    const { orderData } = await req.json();

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
        payment_method: "cod",
        payment_status: "pending",
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
    console.error("save-order error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
