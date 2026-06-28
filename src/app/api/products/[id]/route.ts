import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await currentUser();
  return user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ ...product, image: product.imageUrl });
  } catch (err) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({ where: { id }, data: body });
    return NextResponse.json(product);
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
