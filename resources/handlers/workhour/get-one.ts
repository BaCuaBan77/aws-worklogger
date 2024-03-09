import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

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
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: username },
        ":sk": { S: `workhour#${date}` },
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  };
}
