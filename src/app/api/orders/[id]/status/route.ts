import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await currentUser();
  return user?.emailAddresses.some(e => e.emailAddress === process.env.ADMIN_EMAIL) ?? false;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(order);
}
