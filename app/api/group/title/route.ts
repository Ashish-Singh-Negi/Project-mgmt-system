import { Student } from "@/lib/types";
import Group from "@/models/Group";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // const { user } = req.info;

  const { username, id, projectTitle } = await req.json();

  if (!projectTitle)
    return NextResponse.json(
      {
        message: `Project Title is required`,
      },
      {
        status: 400,
      }
    );

  try {
    // search for group
    const group = await Group.findById(id).exec();

    if (!group)
      return NextResponse.json(
        {
          message: `Group Not Found`,
        },
        {
          status: 400,
        }
      );

    // check for student
    if (
      !group.students.some((student: Student) => student.username === username)
    )
      return NextResponse.json(
        {
          message: `you are not authorized to add report in group`,
        },
        {
          status: 403,
        }
      );

    group.projectTitle = projectTitle;

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: `Project Title added Successfully`,
      },
      {
        status: 201,
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
