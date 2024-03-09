import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBWorkHourStruct,
  CreateWorkHourRequestDTO,
} from "../../../types";

const dynamodb = new DynamoDB({});

export async function addWorkHourToUser(body: string | null) {
  if (!body && body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing Body" }),
    };
  }
  const parsedBody = JSON.parse(body) as CreateWorkHourRequestDTO;
  if (
    !parsedBody.username ||
    !parsedBody.date ||
    !parsedBody.startTimestamp ||
    !parsedBody.endTimestamp ||
    !parsedBody.duration
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing attributes to save work hours",
      }),
    };
  }

  const dynamoItem: DynamoDBWorkHourStruct = {
    pk: parsedBody.username,
    sk: `workhour#${parsedBody.date}`,
    startTimestamp: parsedBody.startTimestamp,
    endTimestamp: parsedBody.endTimestamp,
    duration: parsedBody.duration,
  };
  // Create the work hour item
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: dynamoItem,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Created Work Hour" }),
  };
}
