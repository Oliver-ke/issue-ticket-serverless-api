import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const getTicketsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("Received from API GATEWAY:", event);

  const response = {
    statusCode: 201,
    body: JSON.stringify([]),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
