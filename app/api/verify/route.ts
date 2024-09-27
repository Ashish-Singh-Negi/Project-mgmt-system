import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = cookies().get("token");

    // Verify the token
    const decoded = jwt.verify(
      `${token?.value}`,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!
    );

    // Continue to the next middleware or API logic
    return NextResponse.json(
      {
        message: "Verified successfully",
        data: decoded,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      {
        status: 401,
      }
    );
  }
}
