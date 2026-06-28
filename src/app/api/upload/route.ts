import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "labelnoor/products", resource_type: "image" },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
