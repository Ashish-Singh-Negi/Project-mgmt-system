import mongoose, { models, Schema } from "mongoose";

const RecordSchema = new Schema(
  {
    report: String,
    attendance: [String],
    guideSign: Boolean,
    coordinatorSign: Boolean,
    hodSign: Boolean,
  },
  {
    timestamps: true,
  }
);

const GroupSchema = new Schema(
  {
    guide: {
      type: String,
      require: true,
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
    groupNo: {
      type: Number,
      require: true,
    },
    projectTitle: {
      type: String,
      require: true,
    },
    students: [
      {
        pid: Number,
        rollNo: Number,
        division: String,
        username: String,
        attendance: Number,
      },
    ],
    records: [RecordSchema],
  },
  {
    timestamps: true,
  }
);

const Group = models.Group || mongoose.model("Group", GroupSchema);

export default Group;
