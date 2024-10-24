import { NextRequest, NextResponse } from "next/server";

import connectToDB from "@/config/connecToDB";

import Admin from "@/models/Admin";
import Group from "@/models/Group";
import { Types } from "mongoose";
import { Student } from "@/lib/types";

export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = req.nextUrl;

  const role = searchParams.get("role");
  const branch = searchParams.get("branch");
  const semester = searchParams.get("semester");
  const division = searchParams.get("division");

  // check for role
  if (role !== "HOD" && role !== "Coordinator")
    return NextResponse.json(
      {
        success: false,
        message: `You are not authorized`,
      },
      {
        status: 403,
      }
    );

  try {
    if (branch && semester && division) {
      // Search according to branch, semester and division
      const groups = await Group.find({ branch, semester, division })
        .lean()
        .exec();

      if (!groups.length)
        return NextResponse.json(
          {
            message: `No Groups found at branch ${branch} semester ${semester} and divison ${division}`,
          },
          {
            status: 400,
          }
        );

      return NextResponse.json(
        {
          success: true,
          groups: groups,
        },
        {
          status: 200,
        }
      );
    }

    if (branch && semester) {
      // Search according to branch and semester
      const groups = await Group.find({ branch, semester }).lean().exec();

      if (!groups.length)
        return NextResponse.json(
          {
            message: `No Groups found at branch ${branch} semester ${semester}`,
          },
          {
            status: 400,
          }
        );

      return NextResponse.json(
        {
          success: true,
          groups: groups,
        },
        {
          status: 200,
        }
      );
    }

    if (branch) {
      // Search according to branch
      const groups = await Group.find({ branch }).lean().exec();

      if (!groups.length)
        return NextResponse.json(
          {
            message: `No Groups found at branch ${branch}`,
          },
          {
            status: 400,
          }
        );

      return NextResponse.json(
        {
          success: true,
          message: "Groups Found",
          groups: groups,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: error,
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const { username, role, branch, semester, division, groupNos } =
    await req.json();

  // check for required data
  if (!semester || !division || !groupNos.length)
    return NextResponse.json(
      {
        message: `All Feilds are required`,
      },
      {
        status: 400,
      }
    );

  try {
    for (const groupNo of groupNos) {
      const duplicateGroup = await Group.findOne({
        branch,
        semester,
        division,
        groupNo,
      });

      if (duplicateGroup) {
        return NextResponse.json(
          {
            message: `Group ${groupNo} already exists`,
          },
          {
            status: 409,
          }
        );
      }
    }

    // create groups
    for (const num of groupNos) {
      const groupData = {
        guide: username,
        branch,
        semester,
        division,
        groupNo: num,
        students: [],
        records: [],
      };

      await Group.create(groupData);
    }

    // search for admin
    const teacher = await Admin.findOne({ username, role }).exec();

    // Update admin's guideOf
    const existingGuideOf = teacher.guideOf.find(
      (val: { branch: string; semester: number; division: string }) =>
        val.branch === branch &&
        val.semester === semester &&
        val.division === division
    );

    if (existingGuideOf) {
      existingGuideOf.groupNo.push(...groupNos);
    } else {
      teacher.guideOf.push({
        branch,
        semester,
        division,
        groupNo: groupNos,
      });
    }

    await teacher.save();

    return NextResponse.json(
      {
        success: true,
        message: `New Groups created Successfully`,
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

// Update Group Report check Status
export async function PUT(req: NextRequest) {
  const {
    username,
    role,
    branch,
    id,
    semester,
    division,
    groupNo,
    guideSign,
    coordinatorSign,
    hodSign,
    remark,
    finalAttendance,
  } = await req.json();

  console.log(
    username,
    role,
    branch,
    id,
    semester,
    division,
    groupNo,
    guideSign,
    coordinatorSign,
    hodSign,
    remark,
    finalAttendance
  );

  if (!role || !branch)
    return NextResponse.json(
      {
        message: `${username} is unauthorized`,
      },
      {
        status: 403,
      }
    );

  if (!guideSign && !coordinatorSign && !hodSign)
    return NextResponse.json(
      {
        message: `sign must be provided`,
      },
      {
        status: 400,
      }
    );

  try {
    let group;
    if (role === "Guide") {
      group = await Group.findOne({
        guide: username,
        division,
        groupNo,
      }).exec();

      if (!group)
        return NextResponse.json(
          {
            message: `Group Not Found`,
          },
          {
            status: 404,
          }
        );
    }

    if (role === "Coordinator" || role === "HOD") {
      group = await Group.findOne({
        branch,
        semester,
        division,
        groupNo,
      }).exec();

      if (!group)
        return NextResponse.json(
          {
            message: `Group Not Found`,
          },
          {
            status: 404,
          }
        );
    }

    const report = group.records.find((record: { _id: Types.ObjectId }) =>
      record._id.equals(id)
    );

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Report not found.",
        },
        {
          status: 404,
        }
      );
    }

    report.guideSign = guideSign;
    report.coordinatorSign = coordinatorSign;
    report.hodSign = hodSign;

    if (remark) {
      report.remark = remark;
    }

    if (finalAttendance.length) {
      report.attendance = finalAttendance;

      // Update student attendance
      group.students.forEach((student: Student) => {
        if (finalAttendance.includes(student.username)) {
          student.attendance += 1;
        }
      });
    }

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: `Report Checked`,
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
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const username = searchParams.get("username");
  const branch = searchParams.get("branch");
  const semester = searchParams.get("semester");
  const division = searchParams.get("division");
  const groupNo = searchParams.get("groupNo");

  if (!groupNo || !branch || !semester || !division)
    return NextResponse.json(
      {
        message: `branch , semester , division and group no. are required`,
      },
      {
        status: 400,
      }
    );

  try {
    // serch for group
    const group = await Group.findOne({
      branch,
      semester,
      division,
      groupNo,
    }).exec();

    console.log("Group : ", group);

    if (!group)
      return NextResponse.json(
        {
          message: `Group with branch ${branch}, semester ${semester}, division ${division}, and group number ${groupNo} not found.`,
        },
        {
          status: 404,
        }
      );

    if (username !== group.guide)
      return NextResponse.json(
        {
          message: `You are not authorized to delete group no. ${groupNo}`,
        },
        {
          status: 403,
        }
      );

    const guide = await Admin.findOne({ username: username }).exec();

    if (!guide)
      return NextResponse.json(
        {
          message: `Guide ${username} Not found`,
        },
        {
          status: 404,
        }
      );

    guide.guideOf = guide.guideOf.filter(
      (gr: {
        branch: string;
        semester: number;
        division: string;
        groupNo: number[];
      }) => {
        if (
          gr.branch === branch &&
          gr.semester === parseInt(semester) &&
          gr.division === division
        ) {
          // Remove the groupNo from the array
          gr.groupNo = gr.groupNo.filter(
            (num: number) => num !== parseInt(groupNo)
          );
        }
        return true; // Keep other groups
      }
    );

    console.log(guide.guideOf);

    const result = await group.deleteOne();

    if (!result)
      return NextResponse.json(
        {
          messsage: `Group no ${groupNo} could not be deleted`,
        },
        {
          status: 400,
        }
      );

    await guide.save();

    return NextResponse.json(
      {
        success: true,
        message: `Deleted Group ${groupNo}`,
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
        status: 404,
      }
    );
  }
}
