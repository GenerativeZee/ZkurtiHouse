import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UpdateOrderStatusSchema } from "@/lib/validation";
import { sendOrderStatusUpdate } from "@/lib/email";
import { logger } from "@/lib/logger";
import { ZodError } from "zod";

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await currentUser();
  return user?.emailAddresses.some((e) => e.emailAddress === process.env.ADMIN_EMAIL) ?? false;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    let validatedBody;
    try {
      validatedBody = UpdateOrderStatusSchema.parse(body);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      throw err;
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const updated = await prisma.order.update({
      where: { id },
      data: { status: validatedBody.status },
    });

    await sendOrderStatusUpdate(
      { id: updated.id, orderNumber: updated.orderNumber, customerEmail: updated.customerEmail },
      validatedBody.status
    );

    logger.info("Order status updated", { id, status: validatedBody.status });

    return NextResponse.json(updated);
  } catch (err) {
    logger.error("PATCH /api/orders/[id]/status error", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
