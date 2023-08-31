import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const resolveTicketHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== "PUT") {
    throw new Error(`Expect method PUT`);
  }

  console.info("received:", event);

  const body = JSON.parse(event.body);
  const id = body.id;
  const name = body.name;

  const response = {
    statusCode: 201,
    body: JSON.stringify({ MessageId: "" }),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
