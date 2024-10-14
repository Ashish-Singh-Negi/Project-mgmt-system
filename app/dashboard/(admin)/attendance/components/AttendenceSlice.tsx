import React, { useEffect, useState } from "react";

import { Student } from "@/lib/types";

const AttendenceSlice = ({
  date,
  attendance,
  students,
}: {
  date: string;
  attendance: string[];
  students: Student[];
}) => {
  const [dateIs, setDateIs] = useState(date);

  useEffect(() => {
    const dateIs = new Date(date);

    const day = String(dateIs.getDate()).padStart(2, "0");
    const month = String(dateIs.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = dateIs.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setDateIs(formattedDate);
  }, []);

  return (
    <div className="h-fit w-full flex items-center border-b-2 box-border py-2">
      <p className="w-[20%] text-center">{dateIs}</p>
      {students.map((student, i) => {
        if (student.username === attendance[i])
          return (
            <p
              key={student._id}
              className="w-[20%] text-center text-green-600 flex justify-center font-bold"
            >
              P
            </p>
          );
        else
          return (
            <p
              key={student._id}
              className="w-[20%] text-center text-red-500 flex justify-center font-bold"
            >
              A
            </p>
          );
      })}
    </div>
  );
};

export default AttendenceSlice;
