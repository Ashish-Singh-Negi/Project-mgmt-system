"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const CheckBtn = ({
  name,
  setAttendance,
}: {
  name: string;
  setAttendance: React.Dispatch<React.SetStateAction<string[]>>;
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

  return (
    <button
      type="button"
      onClick={() => setCheck(!check)}
      className={`h-8 w-fit flex items-end gap-2 font-normal `}
    >
      <FaCheckCircle
        className={`${
          check ? "text-blue-500" : "text-gray-500"
        } cursor-pointer h-5 w-5 mb-1 transition-all`}
      />
      <p className="text-xl">{name}</p>
    </button>
  );
};

export default CheckBtn;
