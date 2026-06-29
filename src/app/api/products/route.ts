import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CreateProductSchema } from "@/lib/validation";
import { logger } from "@/lib/logger";
import { ZodError } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const bestseller = searchParams.get("bestseller") === "true";
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(category ? { category: { contains: category, mode: "insensitive" as const } } : {}),
      ...(bestseller ? { isBestseller: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { category: { contains: search, mode: "insensitive" as const } },
              { fabric: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products.map((p) => ({ ...p, image: p.imageUrl })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("GET /api/products error", err);
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
    const data = CreateProductSchema.parse(body);
    const product = await prisma.product.create({ data });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    logger.error("POST /api/products error", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
