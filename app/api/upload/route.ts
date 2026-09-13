import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general"; // 'resume', 'project', 'cert', 'about', 'service'

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Clean and sanitize filename
    const originalExt = path.extname(file.name) || (category === "resume" ? ".pdf" : ".png");
    const sanitizedBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_");
    const timestamp = Date.now();
    const fileName = `${category}-${sanitizedBase}-${timestamp}${originalExt}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

