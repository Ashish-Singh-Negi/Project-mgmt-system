import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookiesStore = cookies();

  const token = cookiesStore.get("token");

  if (!token)
    return NextResponse.json({
      sendStatusCode: 403,
    });

  cookiesStore.delete("token");

  return NextResponse.json(
    {
      success: true,
      message: "Signout Successfully",
    },
    {
      status: 200,
    }
  );
}
