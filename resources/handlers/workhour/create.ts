import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { IWorkHour } from "../../../types";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB({});

export async function createWorkHour(body: string | null) {
  if (!body && body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing Body" }),
    };
  }
  const parsedBody = JSON.parse(body) as IWorkHour;

  // Create the work hour item
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `${parsedBody.date}-${parsedBody.username}`,
        ...parsedBody,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Created Work Hour" }),
  };
}
