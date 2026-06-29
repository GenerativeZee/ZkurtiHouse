import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

const FROM = process.env.EMAIL_FROM || "noreply@labelnoor.com";

export async function sendOrderConfirmation(order: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: Date;
  shippingAddress: Record<string, string>;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name} × ${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#2c2c2c">
        <h2 style="font-family:Georgia,serif;color:#2c2c2c">Thank you, ${order.customerName}!</h2>
        <p>Your order has been confirmed. We'll notify you when it ships.</p>
        <div style="background:#f8f5f0;padding:20px;border-radius:8px;margin:24px 0">
          <p style="margin:0 0 8px"><strong>Order ID:</strong> ${order.orderNumber}</p>
          <p style="margin:0 0 8px"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
          <p style="margin:0"><strong>Ship to:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}</p>
        </div>
        <table style="width:100%;border-collapse:collapse">${itemsHtml}
          <tr style="font-weight:bold">
            <td style="padding:12px 8px">Total</td>
            <td style="padding:12px 8px;text-align:right">₹${order.total.toLocaleString("en-IN")}</td>
          </tr>
        </table>
        <p style="margin-top:32px;color:#888;font-size:12px">Label Noor • Aligarh Heritage Collection</p>
      </div>`,
  }).catch(() => {});
}

export async function sendOrderStatusUpdate(order: {
  orderNumber: string;
  customerEmail: string;
  id: string;
}, status: string) {
  const transporter = getTransporter();
  if (!transporter) return;

  const messages: Record<string, string> = {
    processing: "Your order is being prepared",
    shipped: "Your order is on its way!",
    delivered: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
  };
  const msg = messages[status];
  if (!msg) return;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `${order.orderNumber} — ${msg}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="font-family:Georgia,serif">${msg}</h2>
        <p>Order: <strong>${order.orderNumber}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://labelnoor.com"}/orders/${order.id}"
           style="display:inline-block;background:#d4af37;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;margin-top:16px">
          View Order
        </a>
        <p style="margin-top:32px;color:#888;font-size:12px">Label Noor</p>
      </div>`,
  }).catch(() => {});
}

export async function sendContactEmail(name: string, email: string, subject: string, message: string) {
  const transporter = getTransporter();
  if (!transporter) return;

  await Promise.all([
    transporter.sendMail({
      from: FROM,
      to: email,
      subject: "We received your message — Label Noor",
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="font-family:Georgia,serif">Hi ${name},</h2>
        <p>We received your message and will reply within 24 hours.</p>
        <div style="background:#f8f5f0;padding:16px;border-radius:8px;margin:16px 0">
          <p style="margin:0"><strong>Your message:</strong></p>
          <p style="margin:8px 0 0">${message.replace(/\n/g, "<br>")}</p>
        </div>
        <p style="color:#888;font-size:12px">Label Noor Team</p>
      </div>`,
    }),
    transporter.sendMail({
      from: FROM,
      to: process.env.ADMIN_EMAIL!,
      subject: `Contact: ${subject} — ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    }),
  ]).catch(() => {});
}
