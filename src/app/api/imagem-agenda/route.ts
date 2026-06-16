import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filepath = searchParams.get("path");

  if (!filepath) {
    return new NextResponse("path required", { status: 400 });
  }

  if (!fs.existsSync(filepath)) {
    return new NextResponse("not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filepath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
