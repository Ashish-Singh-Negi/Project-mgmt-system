import React from "react";

const AttandenceTableCard = ({
  pid,
  username,
  rollNo,
  division,
  attendance,
  totalAttendance,
}: {
  pid: string;
  username: string;
  rollNo: number;
  division: string;
  attendance: number;
  totalAttendance: number;
}) => {
  return (
    <div className="h-10 w-full  flex justify-between items-center px-4">
      <p className="h-fit w-[15%]">{pid}</p>
      <p className="h-fit w-[10%]">{rollNo}</p>
      <p className="h-fit w-[10%]">{division}</p>
      <p className="h-fit w-[40%]">{username}</p>
      <p className="h-fit w-[15%]">
        {attendance !== 0
          ? ((attendance / totalAttendance) * 100).toFixed(2)
          : 0}
        %
      </p>
    </div>
  );
};

export default AttandenceTableCard;
