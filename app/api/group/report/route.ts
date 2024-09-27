import { NextRequest, NextResponse } from "next/server";

import Group from "@/models/Group";

import { Student } from "@/lib/types";

const oneSecondInMs = 1000;
const oneMinuteInMs = 60 * oneSecondInMs;
const oneHourInMs = 60 * oneMinuteInMs;
const oneDayInMs = 24 * oneHourInMs;

const calculateTime = (currentTime: number, lastRecordTimeIs: number) => {
  const time = currentTime - lastRecordTimeIs;

  const timeIs = oneDayInMs - time;

  if (timeIs < oneMinuteInMs) {
    return `${Math.round(timeIs / oneSecondInMs)} second`;
  }
  if (timeIs < oneHourInMs) {
    return `${Math.round(timeIs / oneMinuteInMs)} minute`;
  }
  if (timeIs < oneDayInMs) {
    return `${Math.round(timeIs / oneHourInMs)} hour`;
  }
};

export async function POST(req: NextRequest) {
  // const { user } = req.info;
  const { username, attendance, content, branch, semester, division, groupNo } =
    await req.json();

  // Check for required data
  if (!attendance || !branch || !semester || !division || !groupNo || !content)
    return NextResponse.json(
      {
        message: `All feilds are required`,
      },
      {
        status: 400,
      }
    );

  try {
    // Search for group according to request data
    const group = await Group.findOne({
      branch,
      semester,
      division,
      groupNo,
    }).exec();

    if (!group)
      return NextResponse.json(
        {
          message: `Branch ${branch} , semester ${semester} , division ${division} , group no. ${groupNo} Not Found`,
        },
        {
          status: 404,
        }
      );

    if (
      !group.students.some((student: Student) => student.username === username)
    )
      return NextResponse.json(
        {
          message: `you are not authorized to add report in group ${groupNo}`,
        },
        {
          status: 403,
        }
      );

    // Check time of last group record
    if (group.records.length) {
      const lastRecordTime = group.records[group.records.length - 1].createdAt;
      const lastRecordTimeIs = new Date(lastRecordTime).getTime();

      const currentTime = new Date().getTime();

      if (currentTime - lastRecordTimeIs < oneDayInMs) {
        const timeLeft = calculateTime(currentTime, lastRecordTimeIs);

        return NextResponse.json(
          {
            message: `New report can be added after ${timeLeft}`,
          },
          {
            status: 400,
          }
        );
      }
    }

    // passing new report to group records
    group.records.push({
      attendance: attendance,
      report: content,
      guideSign: false,
      coordinatorSign: false,
      hodSign: false,
    });

    // Update student attendance
    group.students.forEach((student: Student) => {
      if (attendance.includes(student.username)) {
        student.attendance += 1;
      }
    });

    await group.save();

    return NextResponse.json(
      {
        success: true,
        message: `new report added successfully`,
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
