import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose
      .connect(`${process.env.NEXT_PUBLIC_DATABASE_URI}`)
      .then(() => console.log("connected to DB"));
  } catch (error: any) {
    console.error(error.message);
  }
};

export default connectToDB;
