import connectToDB from "@/config/connecToDB";
import Group from "@/models/Group";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const branch = searchParams.get("branch");
  const semester = searchParams.get("semester");
  const division = searchParams.get("division");
  const groupNo = searchParams.get("groupNo");

  if (!branch || !semester || !division || !groupNo)
    return NextResponse.json(
      {
        success: false,
        message: `All feilds are required`,
      },
      {
        status: 400,
      }
    );

  try {
    await connectToDB();

    const group = await Group.findOne({ branch, semester, division, groupNo })
      .lean()
      .exec();

    if (group)
      return NextResponse.json(
        {
          success: false,
          message: `Group ${groupNo} already exist`,
        },
        {
          status: 409,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: `Group ${groupNo} is available`,
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
