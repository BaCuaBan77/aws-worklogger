import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { UserWithDateDTO } from "../../../types";

const dynamodb = new DynamoDB({});

export async function deleteWorkHour(body: string | null) {
  if (!body && body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing Body" }),
    };
  }
  const parsedBody = JSON.parse(body) as UserWithDateDTO;
  if (!parsedBody.username || !parsedBody.date) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing attributes to get the work hour",
      }),
    };
  }
  // Create the work hour item
  await dynamodb.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        pk: parsedBody.username,
        sk: `workhour#${parsedBody.date}`,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Logged Work deleted" }),
  };
}
