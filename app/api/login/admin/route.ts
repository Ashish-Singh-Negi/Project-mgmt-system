import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/Admin";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDB from "@/config/connecToDB";

const MAX_AGE = 60 * 1000;

export async function POST(req: NextRequest) {
  connectToDB();

  const { username, password } = await req.json();

  if (!username || !password)
    return NextResponse.json(
      {
        message: `username and password are required`,
      },
      {
        status: 403,
      }
    );
  try {
    // Search for admin
    const foundAdmin = await Admin.findOne({ username }).exec();

    if (!foundAdmin)
      return NextResponse.json(
        {
          success: false,
          message: "Admin Not found",
        },
        {
          status: 404,
        }
      );

    const match = await bcrypt.compare(password, foundAdmin.password);

    if (!match)
      return NextResponse.json(
        {
          message: "Invalid password",
        },
        {
          status: 400,
        }
      );

    const tokenData = {
      username: foundAdmin.username,
      role: foundAdmin.role,
      branch: foundAdmin.branch,
    };

    const token = jwt.sign(
      tokenData,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: MAX_AGE,
      }
    );

    cookies().set("token", token, {
      httpOnly: true,
      maxAge: MAX_AGE,
      secure: true,
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: `Login Successfully`,
        role: foundAdmin.role,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      {
        status: 400,
      }
    );
  }
}
