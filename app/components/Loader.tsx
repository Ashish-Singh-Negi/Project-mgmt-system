import React from "react";

const Loader = ({ size }: { size: string }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`${size} animate-spin rounded-full border-t-2 border-b-2 border-red-500`}
      ></div>
    </div>
  );
};

export default Loader;
