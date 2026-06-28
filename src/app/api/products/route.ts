import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const bestseller = searchParams.get("bestseller") === "true";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category: { contains: category, mode: "insensitive" } } : {}),
        ...(bestseller ? { isBestseller: true } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { fabric: { contains: search, mode: "insensitive" } },
          ]
        } : {}),
      },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json(products.map(p => ({ ...p, image: p.imageUrl })));
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
