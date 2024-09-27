import connectToDB from "@/config/connecToDB";

import Admin from "@/models/Admin";
import Student from "@/models/Student";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = req.nextUrl;

  const user = searchParams.get("user");
  const role = searchParams.get("role");

  try {
    // Search for user
    const foundTeacher = await Admin.findOne({ username: user, role })
      .select("-password -__v")
      .lean()
      .exec();

    const foundStudent = await Student.findOne({ username: user })
      .select("-password -__v")
      .lean()
      .exec();

    if (!foundTeacher && !foundStudent)
      return NextResponse.json(
        { message: "Profile not found" },
        {
          status: 404,
        }
      );

    let profile;

    if (foundStudent) {
      profile = foundStudent;
    }
    if (foundTeacher) {
      profile = foundTeacher;
    }

    return NextResponse.json(
      {
        message: `profile found`,
        profile: profile,
        // return data
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 400,
      }
    );
  }
}
