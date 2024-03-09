import { APIGatewayProxyEvent } from "aws-lambda";
import { getWorkHourFromUsernameBasedOnDate } from "../handlers/workhour/get-one";
import { deleteWorkHour } from "../handlers/workhour/delete";
import { addWorkHourToUser } from "../handlers/workhour/create";

export const handler = async (event: APIGatewayProxyEvent) => {
  const body = event.body;
  const username = event.pathParameters?.username;
  const date = event.pathParameters?.date;

  try {
    switch (event.httpMethod) {
      case "GET":
        return await getWorkHourFromUsernameBasedOnDate(username, date);
      case "DELETE":
        return await deleteWorkHour(body);
      case "POST":
        return await addWorkHourToUser(body);
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
