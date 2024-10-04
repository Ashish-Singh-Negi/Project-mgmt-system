import { NextRequest, NextResponse } from "next/server";

import Group from "@/models/Group";
import Student from "@/models/Student";

import bcrypt from "bcrypt";
import connectToDB from "@/config/connecToDB";

export async function GET() {
  await connectToDB();

  try {
    //search for all existing students
    const students = await Student.find().select("-_id -password").lean();

    if (!students.length)
      return NextResponse.json(
        {
          message: "No Student found",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        students,
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

export async function POST(req: NextRequest) {
  const {
    pid,
    username,
    password,
    rollNo,
    groupNo,
    branch,
    semester,
    division,
  } = await req.json();

  // check for required data
  if (
    !pid ||
    !username ||
    !password ||
    !branch ||
    !semester ||
    !division ||
    !rollNo ||
    !groupNo
  )
    return NextResponse.json(
      { message: "All feilds are required" },
      {
        status: 400,
      }
    );

  try {
    // search for duplicate student pid
    const duplicatePid = await Student.findOne({ pid }).lean().exec();

    if (duplicatePid)
      return NextResponse.json(
        { message: `pid ${pid} already exists` },
        { status: 409 }
      );

    // search for duplicate username
    const duplicateName = await Student.findOne({ username }).lean().exec();

    if (duplicateName)
      return NextResponse.json(
        { message: `${username} already exists` },
        {
          status: 409,
        }
      );

    // search for duplicate student class
    const duplicateUser = await Student.findOne({
      branch,
      semester,
      division,
      rollNo,
    })
      .lean()
      .exec();

    if (duplicateUser)
      return NextResponse.json(
        {
          message: `Roll No ${rollNo} at branch ${branch} with semester ${semester} at division ${division} already exists`,
        },
        {
          status: 409,
        }
      );

    // Search for group
    const group = await Group.findOne({
      branch,
      semester,
      division,
      groupNo,
    }).exec();

    if (!group)
      return NextResponse.json(
        {
          message: `No Group ${groupNo} Found with branch ${branch} , semester ${semester} and division ${division}`,
        },
        {
          status: 404,
        }
      );

    if (group.students.length >= 4)
      return NextResponse.json(
        { message: `Group is full` },
        {
          status: 400,
        }
      );

    group.students.push({
      pid,
      username,
      rollNo,
      division,
      attendance: 0,
    });

    await group.save();

    // hash password
    const hashpwd = await bcrypt.hash(password, 10);

    await Student.create({
      pid: pid,
      username: username,
      password: hashpwd,
      rollNo: rollNo,
      groupNo: groupNo,
      branch: branch,
      semester: semester,
      division: division,
      attendance: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${username} registered`,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
      },
      {
        status: 400,
      }
    );
  }
}

export async function PUT() {}

export async function DELETE(req: NextRequest) {
  const { pid, username } = await req.json();

  // check for pid and username
  if (!pid || !username)
    return NextResponse.json(
      {
        message: `pid and username are required`,
      },
      {
        status: 400,
      }
    );

  try {
    const student = await Student.findOne({ pid, username })
      .select("-password")
      .exec();

    if (!student)
      return NextResponse.json(
        {
          message: `No student found with ${username} and pid ${pid}`,
        },
        {
          status: 404,
        }
      );

    await student.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: `Username ${username} with pid ${pid} deleted `,
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
