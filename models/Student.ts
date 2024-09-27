import mongoose, { Schema, models } from "mongoose";

const StudentSchema = new Schema(
  {
    pid: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    rollNo: {
      type: Number,
      require: true,
    },
    groupNo: {
      type: Number,
    },
    branch: {
      type: String,
      require: true,
    },
    semester: {
      type: Number,
      require: true,
    },
    division: {
      type: String,
      require: true,
    },
    attendance: {
      type: Number,
      require: true,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

const Student = models.Student || mongoose.model("Student", StudentSchema);

export default Student;
