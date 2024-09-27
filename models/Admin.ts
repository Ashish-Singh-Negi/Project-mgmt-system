import mongoose, { models, Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    branch: String,
    guideOf: {
      type: [
        {
          branch: String,
          semester: Number,
          division: String,
          groupNo: [Number],
        },
      ],
      require: true,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

const Admin = models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
