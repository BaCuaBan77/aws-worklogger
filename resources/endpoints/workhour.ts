import { APIGatewayProxyEvent } from "aws-lambda";
import { createWorkHour } from "../handlers/workhour/create";

export const handler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters?.id;
  const body = event.body;

  try {
    switch (event.httpMethod) {
      case "GET":
        return await getOne({ id });
      case "DELETE":
        return await deleteWorkHour({ id });
      case "POST":
        return await createWorkHour(body);
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
