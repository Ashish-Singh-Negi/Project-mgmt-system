import React from "react";

const TableHead = ({ role }: { role: "HOD" | "Coordinator" | "Guide" }) => {
  return (
    <>
      {role === "Guide" && (
        <div className="h-12 w-full text-sm md:text-xl border-2 flex items-center border-red-400 font-medium transition-all">
          <p className="w-[5%] text-center">Gno.</p>
          <p className="w-[5%] text-center">Sem</p>
          <p className="w-[15%] text-center">Date</p>
          <p className="w-[55%] text-center">Report</p>
          <p className="w-[20%] text-center">Check</p>
        </div>
      )}
      {role === "Coordinator" && (
        <div className="h-12 w-full text-sm md:text-xl border-2 flex items-center border-red-400 font-medium transition-all">
          <p className="w-[5%] text-center">Gno.</p>
          <p className="w-[5%] text-center">Sem</p>
          <p className="w-[15%] text-center">Date</p>
          <p className="w-[45%] text-center">Report</p>
          <p className="w-[15%] text-center">Guide</p>
          <p className="w-[15%] text-center">Coordinator</p>
        </div>
      )}
      {role === "HOD" && (
        <div className="h-12 w-full text-sm md:text-base lg:text-xl border-2 flex items-center border-red-400 font-medium transition-all">
          <p className="w-[5%] text-center">Gno.</p>
          <p className="w-[5%] text-center">Sem</p>
          <p className="w-[15%] text-center">Date</p>
          <p className="w-[45%] text-center">Report</p>
          <p className="w-[10%] text-center">Guide</p>
          <p className="w-[10%] text-center">Coor..</p>
          <p className="w-[10%] text-center">Hod</p>
        </div>
      )}
    </>
  );
};

export default TableHead;
