"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const AttendanceBtn = ({
  name,
  setAttendance,
  size,
  textSize,
  isCheck,
}: {
  name: string;
  setAttendance: React.Dispatch<React.SetStateAction<string[]>>;
  size: string;
  textSize: string;
  isCheck: boolean;
}) => {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (check) setAttendance((prev) => [...prev, name]);
    else {
      setAttendance((prev) => {
        prev.map((val, i) => {
          if (val === name) {
            prev.splice(i, 1);
          }
        });
        return prev;
      });
    }
  }, [check]);

  useEffect(() => {
    setCheck(isCheck);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setCheck(!check)}
      className={`h-fit w-fit flex items-end gap-2 font-normal`}
    >
      <FaCheckCircle
        className={`${size} ${
          check ? "text-blue-500" : "text-gray-500"
        } cursor-pointer mb-1 transition-all`}
      />
      <p className={`${textSize}`}>{name}</p>
    </button>
  );
};

export default AttendanceBtn;
