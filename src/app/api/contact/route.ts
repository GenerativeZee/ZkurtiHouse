import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = Schema.parse(body);

    await sendContactEmail(name, email, subject, message);
    logger.info("Contact form submitted", { email });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    logger.error("POST /api/contact error", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
