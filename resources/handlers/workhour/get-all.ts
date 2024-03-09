import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";
import { WorkHourResponseDTO } from "../../../types";

const dynamodb = new DynamoDB({});

export async function getAllWorkHourFromUsername(username: string) {
  // Create the work hour item
  const response = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: username },
        ":sk": { S: "workhour#" },
      },
    })
  );
  let workHours: WorkHourResponseDTO[] = [];
  if (response.Items) {
    workHours = response.Items.map((item) => ({
      startTimestamp: parseInt(item.startTimestamp.N!),
      endTimestamp: parseInt(item.endTimestamp.N!),
      date: item.sk.S!.split("#")[1], // Extract date from the sort key
      duration: parseInt(item.duration.N!),
    }));
  }
  return {
    statusCode: 200,
    body: JSON.stringify(workHours),
  };
}
