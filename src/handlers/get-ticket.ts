import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDbClient } from "../utils/dynamodb";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ITicketReply } from "../utils/types";

const tableName = process.env.TICKET_TABLE;
const replyTableName = process.env.TICKET_REPLY_TABLE;

export const getTicketHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("Received from API GATEWAY:", event);

  const ticketId = event.pathParameters.id;

  const dbClient = getDbClient();
  const getTicketCommand = new GetCommand({
    Key: { id: ticketId },
    TableName: tableName,
  });

  const ticket = await dbClient.send(getTicketCommand);
  if (!ticket.Item) throw new Error("Ticket with id not found");

  const scanCommand = new ScanCommand({
    TableName: replyTableName,
    FilterExpression: "#n0 = :v0",
    ExpressionAttributeNames: {
      "#n0": "ticketId",
    },
    ExpressionAttributeValues: { ":v0": { S: ticketId } },
  });

  const res = await dbClient.send(scanCommand);
  const _ticketReplies: ITicketReply[] = res.Items.map((it) => ({
    createdOn: it.createdOn.S,
    id: it.id.S,
    message: it.message.S,
    ticketId: it.ticketId.S,
  }));

  const response = {
    statusCode: 201,
    body: JSON.stringify({ ...ticket.Item, replies: _ticketReplies }),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
