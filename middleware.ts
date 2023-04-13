import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";

// ============================================================================

export const config = { matcher: "/" };

// ============================================================================

export async function middleware(req: NextRequest) {
  try {
    if (await get("isUnderMaintenance")) {
      req.nextUrl.pathname = "/_maintenance";

      return NextResponse.rewrite(req.nextUrl);
    }
  } catch (error) {
    // console.error(error);
  }
}
