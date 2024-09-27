export type Student = {
  _id: string;
  pid: string;
  username: string;
  rollNo: number;
  division: string;
  attendance: number;
};

export type Record = {
  _id: string;
  report: string;
  attendance: string[];
  guideSign: boolean;
  coordinatorSign: boolean;
  hodSign: boolean;
  createdAt: string;
};

export type Group = {
  _id: string;
  guide: string;
  projectTitle: string;
  branch: string;
  semester: number;
  division: string;
  groupNo: number;
  students: Student[];
  records: Record[];
  createdAt: string;
};
