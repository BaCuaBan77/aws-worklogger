import { DynamoDB, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { WorkHourResponseDTO } from "../../../types";

const dynamodb = new DynamoDB({});

export async function getWorkHourFromUsernameBasedOnDate(
  username?: string,
  date?: string
) {
  if (!username || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing username to get work hours",
      }),
    };
  }

  // Create the work hour item
  const response = await dynamodb.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        pk: { S: username },
        sk: { S: `workhour#${date}` },
      },
    })
  );

  const item = response.Item;

  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify("No items are found"),
    };
  }

  const workHourResponseDto: WorkHourResponseDTO = {
    startTimestamp: parseInt(item.startTimestamp.N!),
    endTimestamp: parseInt(item.endTimestamp.N!),
    date: item.sk.S!.split("#")[1], // Extract date from the sort key
    duration: parseInt(item.duration.N!),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(workHourResponseDto),
  };
}
