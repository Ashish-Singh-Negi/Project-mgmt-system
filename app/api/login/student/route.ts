import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Student from "@/models/Student";
import connectToDB from "@/config/connecToDB";

const MAX_AGE = 60 * 1000;

export async function POST(req: NextRequest) {
 await connectToDB();

  const { username, password } = await req.json();

  if (!username || !password)
    return NextResponse.json(
      {
        message: `username and password are required`,
      },
      {
        status: 400,
      }
    );

  try {
    // Search for student user
    const foundStudent = await Student.findOne({ username }).exec();

    if (!foundStudent)
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );

    const match = await bcrypt.compare(password, foundStudent.password);

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
      username: foundStudent.username,
      branch: foundStudent.branch,
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
