import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { getDbClient } from "../utils/dynamodb";
import { ITicket } from "../utils/types";

const tableName = process.env.TICKET_TABLE;
export const getTicketsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("Received from API GATEWAY:", event);

  const query = event.queryStringParameters as { resolved: string };
  const resolved = query?.resolved === "1" ? true : false;

  const dbClient = getDbClient();

  const scanCommand = new ScanCommand({
    TableName: tableName,
    FilterExpression: "#n0 = :v0",
    ExpressionAttributeNames: {
      "#n0": "resolved",
    },
    ExpressionAttributeValues: { ":v0": { BOOL: resolved } },
  });

  const tickets = await dbClient.send(scanCommand);
  const _tickets: ITicket[] = tickets.Items.map((it) => ({
    id: it.id?.S || "",
    createOn: it.createOn?.S || "",
    description: it.description?.S || "",
    resolved: it.resolved?.BOOL || false,
    title: it.title?.S || "",
  }));

  const response = {
    statusCode: 201,
    body: JSON.stringify(_tickets || []),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
