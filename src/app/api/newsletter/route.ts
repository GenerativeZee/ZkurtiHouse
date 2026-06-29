import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";

const Schema = z.object({ email: z.string().email("Invalid email") });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = Schema.parse(body);

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, already: true });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    logger.info("Newsletter subscriber added", { email });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    logger.error("POST /api/newsletter error", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
