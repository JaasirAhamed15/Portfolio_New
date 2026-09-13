import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData, PortfolioData } from "@/lib/portfolio-storage";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ success: false, message: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body: PortfolioData = await request.json();
    await savePortfolioData(body);

    return NextResponse.json({ success: true, message: "Portfolio data saved successfully" });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json({ success: false, message: "Failed to save data" }, { status: 500 });
  }
}

