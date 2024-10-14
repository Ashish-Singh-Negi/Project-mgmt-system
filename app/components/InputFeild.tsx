import React, { useEffect, useState } from "react";

import Loader from "./Loader";

const InputFeild = ({
  width,
  inputType,
  inputPlaceholder,
  checkGroupNumberExistOrNot,
}: {
  width: string;
  inputType: string;
  inputPlaceholder: string;
  checkGroupNumberExistOrNot: (number: number) => Promise<boolean>;
}) => {
  const [number, setNumber] = useState("");
  const [avilable, setAvilable] = useState(true);

  const [loading, setLoading] = useState(false);

  const checkGroupNumber = async () => {
    setLoading(true);
    const result = await checkGroupNumberExistOrNot(parseInt(number));
    setLoading(false);

    if (!result) {
      setAvilable(false);
      return;
    }

    setAvilable(true);
  };

  useEffect(() => {
    if (number) {
      checkGroupNumber();
    }
  }, [number]);

  return (
    <>
      <div className={`relative h-10 w-72 ${width}`}>
        <input
          value={number!}
          onChange={(e) => setNumber(e.target.value)}
          required
          type={inputType}
          placeholder={inputPlaceholder}
          className={`h-10 w-full outline-none border-2 border-red-200 px-2 rounded-md focus:border-blue-400 transition-all ${
            !avilable &&"focus:border-red-500"
          }`}
        />
        <div
          className={`h-6 w-6 absolute top-[8px] right-2 flex justify-center items-center `}
        >
          {loading && <Loader size="h-4 w-4" />}
        </div>
      </div>
    </>
  );
};

export default InputFeild;
