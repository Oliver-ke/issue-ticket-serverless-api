import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDbClient } from "../utils/dynamodb";

const tableName = process.env.TICKET_TABLE;
export const resolveTicketHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("received:", event);

  if (event.httpMethod !== "PUT") {
    throw new Error(`Expect method PUT`);
  }

  const ticketId = event.pathParameters.id;
  const getTicketCommand = new GetCommand({
    Key: { id: ticketId },
    TableName: tableName,
  });

  const updateTicketCommand = new UpdateCommand({
    Key: { id: ticketId },
    TableName: tableName,
    AttributeUpdates: {
      resolved: { Value: true },
    },
  });

  try {
    const dbClient = getDbClient();
    const ticket = await dbClient.send(getTicketCommand);

    if (!ticket.Item)
      throw new Error(`Ticket with the given id ${ticketId} not found`);

    await dbClient.send(updateTicketCommand);

    const response = {
      statusCode: 201,
      body: JSON.stringify({ ticket: { ...ticket.Item, resolved: true } }),
    };
    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
  } catch (err) {
    const msg = err.message || "Failed to reply ticket";
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: msg }),
    };

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
  }
};
