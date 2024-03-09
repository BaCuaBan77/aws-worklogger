import { AttributeValue } from "@aws-sdk/client-dynamodb";

/**
 * Request DTOs
 */

// POST: /workhour
export interface CreateWorkHourRequestDTO {
  username?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  date?: string;
  duration?: number;
}

// DELETE: /workhour
export interface UserWithDateDTO {
  username: string;
  date: string;
}

/**
 * Response DTOs
 */

// GET: /workhour/{username}/{date}
// GET: /workhours/{username}
export interface WorkHourResponseDTO {
  startTimestamp: number;
  endTimestamp: number;
  date: string;
  duration: number;
}

interface DynamoDBGeneralStruct {
  pk: AttributeValue | string;
  sk: AttributeValue | string;
}

export type DynamoDBWorkHourStruct = DynamoDBGeneralStruct & {
  startTimestamp: AttributeValue | number;
  endTimestamp: AttributeValue | number;
  duration: AttributeValue | number;
};

export type DynamoDBUserStruct = DynamoDBGeneralStruct & {
  email: AttributeValue;
  role: AttributeValue;
  isWorking: AttributeValue;
};
export enum UserRole {
  EMPLOYER = "employer",
  EMPLOYEE = "employee",
}
