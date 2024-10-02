import React, { useEffect, useState } from "react";

import { FaCheckCircle } from "react-icons/fa";

const InputFeild = ({
  width,
  inputType,
  inputPlaceholder,
  setState,
}: {
  width: string;
  inputType: string;
  inputPlaceholder: string;
  setState: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [number, setNumber] = useState("");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (number) {
    }
  }, [number]);

  useEffect(() => {
    if (number) setState((prev) => [...prev, parseInt(number)]);
  }, [confirm]);

  return (
    <>
      <div className={`relative h-10 w-72 ${width}`}>
        {confirm ? (
          <input
            value={number!}
            required
            type={inputType}
            placeholder={inputPlaceholder}
            className={`h-10 w-full outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all ${
              confirm && "cursor-not-allowed"
            }`}
            disabled
          />
        ) : (
          <input
            value={number!}
            onChange={(e) => setNumber(e.target.value)}
            required
            type={inputType}
            placeholder={inputPlaceholder}
            className={`h-10 w-full outline-none border-2 border-red-200 focus:border-blue-400 px-2 rounded-md transition-all ${
              confirm && "cursor-not-allowed"
            }`}
          />
        )}
        <div
          onClick={() => setConfirm(true)}
          className={`h-6 w-6 absolute top-[8px] right-2 flex justify-center items-center ${
            confirm
              ? "text-blue-500 cursor-not-allowed"
              : "cursor-pointer text-gray-600"
          }`}
        >
          <FaCheckCircle className="h-4 w-4" />
        </div>
      </div>
    </>
  );
};

export default InputFeild;
