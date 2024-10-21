"use client";

import React, { useEffect, useState } from "react";

import Loader from "./Loader";

import { FaCheckCircle } from "react-icons/fa";

const InputFeild = ({
  width,
  inputType,
  inputPlaceholder,
  checkGroupNumberExistOrNot,
  setGroupNo,
}: {
  width: string;
  inputType: string;
  inputPlaceholder: string;
  checkGroupNumberExistOrNot: (number: number) => Promise<boolean>;
  setGroupNo: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [number, setNumber] = useState("");
  const [isAvilable, setIsAvilable] = useState(true);
  const [isConfirm, setIsConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const checkGroupNumber = async () => {
    setLoading(true);
    const result = await checkGroupNumberExistOrNot(parseInt(number));
    setLoading(false);

    if (!result) {
      setIsAvilable(false);
      return;
    }

    setIsAvilable(true);
  };

  useEffect(() => {
    if (number) {
      checkGroupNumber();
    }
  }, [number]);

  useEffect(() => {
    if (isConfirm) setGroupNo((prev) => [...prev, parseInt(number)]);
  }, [isConfirm]);

  return (
    <>
      <div className={`relative h-10 w-72 ${width}`}>
        {isConfirm ? (
          <input
            value={number!}
            onChange={(e) => setNumber(e.target.value)}
            disabled
            type={inputType}
            placeholder={inputPlaceholder}
            className={`h-10 w-full outline-none border-2 border-red-200 px-2 rounded-md focus:border-blue-400 transition-all cursor-not-allowed`}
          />
        ) : (
          <input
            value={number!}
            onChange={(e) => setNumber(e.target.value)}
            required
            type={inputType}
            placeholder={inputPlaceholder}
            className={`h-10 w-full outline-none border-2 border-red-200 px-2 rounded-md focus:border-blue-400 transition-all ${
              !isAvilable && "focus:border-red-500"
            }`}
          />
        )}
        <div
          className={`h-6 w-6 absolute top-[8px] right-2 flex justify-center items-center `}
        >
          {loading && <Loader size="h-4 w-4" />}
          {!loading && isAvilable && (
            <button
              onClick={() => setIsConfirm(true)}
              type="button"
              className={` cursor-pointer ${
                isConfirm && "text-blue-500 cursor-not-allowed"
              }`}
            >
              <FaCheckCircle className={`h-4 w-4 `} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InputFeild;
