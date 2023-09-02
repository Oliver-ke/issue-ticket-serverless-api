import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ITicketReply } from "../utils/types";
import { v4 as uuid } from "uuid";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDbClient } from "../utils/dynamodb";

const replyTableName = process.env.TICKET_REPLY_TABLE;
export const replyTicketHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("received:", event);
  if (event.httpMethod !== "POST") {
    throw new Error(`Expect POST request`);
  }

  const ticketId = event.pathParameters.id;
  const { message } = JSON.parse(event.body) as { message: string };

  const reply: ITicketReply = {
    ticketId,
    message,
    id: uuid(),
    createdOn: new Date().toISOString(),
  };

  const command = new PutCommand({
    Item: reply,
    TableName: replyTableName,
  });

  const dbClient = getDbClient();
  await dbClient.send(command);

  const response = {
    statusCode: 201,
    body: JSON.stringify(reply),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
