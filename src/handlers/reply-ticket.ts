import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const replyTicketHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== "POST") {
    throw new Error(`Expect POST request`);
  }

  console.info("received:", event);
  const id = event.pathParameters.id;

  const response = {
    statusCode: 200,
    body: JSON.stringify([]),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
