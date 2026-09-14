
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

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

    const originalExt = path.extname(file.name) || (category === "resume" ? ".pdf" : ".png");
    const sanitizedBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_");
    const timestamp = Date.now();
    const fileName = `${category}-${sanitizedBase}-${timestamp}${originalExt}`;

    // 1. If Vercel Blob storage is configured, upload directly to Blob CDN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(fileName, buffer, {
          access: "public",
          contentType: file.type || "application/octet-stream",
        });
        return NextResponse.json({
          success: true,
          url: blob.url,
          fileName,
        });
      } catch (blobErr) {
        console.error("Vercel Blob upload error:", blobErr);
      }
    }

    // 2. Try writing to local disk (when running on localhost)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        fileName,
      });
    } catch (fsErr) {
      // 3. Read-only filesystem fallback (e.g. Vercel without Blob configured):
      // Store smaller images (< 4.5MB) as persistent base64 data URIs so user is never blocked!
      if (file.size <= 4.5 * 1024 * 1024) {
        const mimeType = file.type || (originalExt === ".pdf" ? "application/pdf" : "image/png");
        const base64Url = `data:${mimeType};base64,${buffer.toString("base64")}`;
        return NextResponse.json({
          success: true,
          url: base64Url,
          fileName,
        });
      }

      console.error("Local disk write error on read-only system:", fsErr);
      throw fsErr;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

