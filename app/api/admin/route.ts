import Admin from "@/models/Admin";
import Group from "@/models/Group";

import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

// import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Search for all teachers exists in DB
    const admins = await Admin.find().select("-_id -password").lean();

    if (!admins.length)
      return NextResponse.json(
        { message: `No Teachers found` },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: `Admin Found`,
        data: admins,
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

export async function POST(req: NextRequest) {
  const { username, password, role, branch, guideOf } = await req.json();

  // check for required feilds
  if (!username || !password || !role)
    return NextResponse.json(
      {
        message: "username, password and role are required",
      },
      {
        status: 400,
      }
    );

  // check for HOD Or Coordinator branch Name
  if ((role === "HOD" || role === "Coordinator") && !branch)
    return NextResponse.json(
      { message: `Branch must be passed` },
      {
        status: 400,
      }
    );

  if (!password)
    NextResponse.json(
      { message: "Enter a password" },
      {
        status: 400,
      }
    );

  // Check for Guide Data
  if (
    role === "Guide" &&
    (!guideOf?.semester || !guideOf?.groupNo.length || !guideOf?.division)
  )
    return NextResponse.json(
      {
        message: "Guide must pass Branch , semester , Group no. ",
      },
      {
        status: 400,
      }
    );

  try {
    // Search for Duplicate Guide , HOD and Coordinator username
    const duplicateGuideName = await Admin.findOne({ username })
      .select("-_id -password")
      .lean()
      .exec();

    if (duplicateGuideName)
      return NextResponse.json(
        {
          message: `${username} username already exists`,
        },
        {
          status: 409,
        }
      );

    if (role === "HOD" || role === "Coordinator") {
      // Search for Duplicate HOD Or Coordinator
      const duplicateRole = await Admin.findOne({
        username: username,
        role: role,
        branch: branch,
      })
        .select("-_id -password")
        .lean()
        .exec();

      if (duplicateRole)
        return NextResponse.json(
          {
            message: `${role} already exist in branch ${branch}`,
          },
          {
            status: 409,
          }
        );

      // Search for HOD or Coordinater for particular branch or department
      const isExist = await Admin.findOne({
        role,
        branch,
      })
        .select("-_id -password")
        .lean()
        .exec();

      if (isExist)
        return NextResponse.json(
          {
            message: `${role} for ${branch} already exist`,
          },
          {
            status: 409,
          }
        );
    }

    // search for duplicate group
    if (guideOf) {
      const duplicateGroup = await Group.findOne({
        branch: branch,
        semester: guideOf.semester,
        division: guideOf.division,
        groupNo: guideOf.groupNo,
      })
        .lean()
        .exec();

      if (duplicateGroup)
        return NextResponse.json(
          {
            message: `Group already Exist!`,
          },
          {
            status: 409,
          }
        );
    }

    //TODO: write check for group no too

    // Create and store new group document
    if (guideOf) {
      guideOf?.groupNo?.map((num: number) => {
        (async () => {
          const groupData = {
            guide: username,
            branch: branch,
            semester: guideOf.semester,
            division: guideOf.division,
            projectTitle: "",
            groupNo: num,
            students: [],
            records: [],
          };

          await Group.create(groupData);
        })();
      });
    }

    // hash password
    const hashPwd = await bcrypt.hash(password, 10);

    const newTeacher = {
      username,
      password: hashPwd,
      role,
      branch,
      guideOf,
    };

    // create and store new Guide , Cooordinator Or HOD
    await Admin.create(newTeacher);

    return NextResponse.json(
      {
        message: `New ${role} ${username} Created`,
      },
      {
        status: 201,
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

export async function PUT() {
  //   const { user, role, branch } = req.admin;
  //   const {
  //     guideOf,
  //   }: {
  //     guideOf: { semester: number; division: string; groupNo: number[] };
  //   } = req.body;
  //   // check for required data
  //   if (branch || !guideOf?.semester || !guideOf?.groupNo || !guideOf?.division)
  //     return NextResponse.json({
  //       message: `branch , semester , division and group no. are required`,
  //     });
  //   if (!user)
  //     return NextResponse.json({
  //       message: `your are not authorized to create a group`,
  //     });
  //   try {
  //     const teacher = await Admin.findOne({
  //       username: user,
  //       role,
  //     }).exec();
  //     if (!teacher)
  //       return NextResponse.json({
  //         message: `${role} not found`,
  //       });
  //     // search for duplicate group
  //     if (guideOf) {
  //       const duplicateGroup = await Group.findOne({
  //         branch: guideOf.branch,
  //         semester: guideOf.semester,
  //         division: guideOf.division,
  //         groupNo: guideOf.groupNo,
  //       }).exec();
  //       if (duplicateGroup)
  //         return NextResponse.json({
  //           message: `Group already Exist!`,
  //         });
  //     }
  //     // Create and store new group document
  //     if (guideOf) {
  //       guideOf?.groupNo?.map((num) => {
  //         (async () => {
  //           const groupData = {
  //             guide: user,
  //             branch: guideOf.branch,
  //             semester: guideOf.semester,
  //             division: guideOf.division,
  //             groupNo: num,
  //             students: [],
  //             records: [],
  //           };
  //           await Group.create(groupData);
  //         })();
  //       });
  //     }
  //     await teacher.save();
  //     return NextResponse.json(
  //       {
  //         success: true,
  //         message: `New group created`,
  //       },
  //       {
  //         status: 201,
  //       }
  //     );
  //   } catch (error) {
  //     return NextResponse.json(
  //       {
  //         message: error,
  //       },
  //       {
  //         status: 400,
  //       }
  //     );
  //   }
}

export async function DELETE() {}
