import { NextRequest, NextResponse } from "next/server";

import connectToDB from "@/config/connecToDB";

import Group from "@/models/Group";

import { Student } from "@/lib/types";

type Props = {
  params: {
    semester: string;
  };
};

export async function GET(req: NextRequest, { params: { semester } }: Props) {
  await connectToDB();

  const searchParams = req.nextUrl.searchParams;

  const username = searchParams.get("username");
  const branch = searchParams.get("branch");
  const role = searchParams.get("role");
  const division = searchParams.get("division");
  const groupNo = searchParams.get("groupNo");

  //check for required data

  if (!branch || !semester || !division)
    return NextResponse.json(
      {
        message: `branch , semester , division and group no. are required`,
      },
      {
        status: 400,
      }
    );

  if (!role) {
    if (!groupNo)
      return NextResponse.json(
        {
          message: `Group no. are required`,
        },
        {
          status: 400,
        }
      );
  }

  try {
    // check for student
    if (!role && username && branch && semester && division && groupNo) {
      const group = await Group.findOne({
        branch,
        semester,
        division,
        groupNo,
      }).exec();

      if (!group)
        return NextResponse.json(
          {
            message: `No Group found with no. ${groupNo} branch ${branch} semester ${semester} division ${division}`,
          },
          {
            status: 400,
          }
        );

      const result = group.students.some(
        (student: Student) => student.username === username
      );

      if (!result)
        return NextResponse.json(
          {
            message: `You are not member of Group ${groupNo}`,
          },
          {
            status: 403,
          }
        );

      return NextResponse.json(
        {
          success: true,
          message: `Group Found`,
          group: group,
        },
        {
          status: 200,
        }
      );
    }

    if (role !== "Guide")
      return NextResponse.json(
        {
          message: `${username} is not Guide of Group no. ${groupNo}`,
        },
        {
          status: 403,
        }
      );

    const isGuideOfGroup = await Group.findOne({
      guide: username,
      branch,
      semester,
      division,
    })
      .lean()
      .exec();

    if (!isGuideOfGroup)
      return NextResponse.json(
        {
          success: false,
          message: `${username} ia not Guide of Group ${groupNo}`,
        },
        {
          status: 403,
        }
      );

    // Search for 1 group only
    if (groupNo) {
      const group = await Group.findOne({
        guide: username,
        branch,
        semester,
        division,
        groupNo,
      })
        .lean()
        .exec();

      if (!group)
        return NextResponse.json(
          {
            success: false,
            message: `unauthorized`,
          },
          {
            status: 403,
          }
        );

      return NextResponse.json(
        {
          success: true,
          message: `Group Found`,
          group: group,
        },
        {
          status: 200,
        }
      );
    }

    // Search for multiple groups
    const groups = await Group.find({
      branch,
      semester,
      division,
    })
      .lean()
      .exec();

    if (!groups.length)
      return NextResponse.json(
        {
          message: `Group Not Found`,
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Group Found",
        groups: groups,
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
