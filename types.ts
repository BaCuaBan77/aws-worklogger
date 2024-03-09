export interface IWorkHour {
  startTimestamp: number;
  endTimestamp: number;
  date: Date;
  duration: number;
  username: string;
}

// TODO: Not in used yet
export interface IUser {
  username: string;
  email: string;
  role: UserRole;
  isWorking: boolean;
}

export enum UserRole {
  EMPLOYER = "employer",
  EMPLOYEE = "employee",
}
