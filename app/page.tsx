import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-60 w-96 border-2 border-red-300 rounded-md flex flex-col items-center gap-6 font-medium">
        <h1 className="text-red-600 font-bold text-4xl mt-5 mb-3">Promanage</h1>
        <Link href={"/student/login"}>
          <button className="h-10 w-72 bg-red-400 text-white rounded-md active:scale-95 hover:bg-red-500 transition-all">
            {" "}
            Student login
          </button>
        </Link>
        <Link href={"/admin/login"}>
          <button className="h-10 w-72 bg-red-400 text-white rounded-md active:scale-95 hover:bg-red-500 transition-all">
            {" "}
            Admin login
          </button>
        </Link>
      </div>
    </div>
  );
}
