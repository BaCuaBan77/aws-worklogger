import { APIGatewayProxyEvent } from "aws-lambda";
import { getAllWorkHourFromUsername } from "../handlers/workhour/get-all";

export const handler = async (event: APIGatewayProxyEvent) => {
  const username = event.pathParameters?.username;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing username to get work hours",
      }),
    };
  }
  try {
    switch (event.httpMethod) {
      case "GET":
        return await getAllWorkHourFromUsername(username);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid HTTP method" }),
        };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
