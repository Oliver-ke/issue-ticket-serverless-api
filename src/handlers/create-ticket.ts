import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDbClient } from "../utils/dynamodb";
import { v4 as uuid } from "uuid";
import { ITicket } from "../utils/types";

const tableName = process.env.TICKET_TABLE;
export const createTicketHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== "POST") {
    throw new Error(`Endpoint expect a POST request`);
  }

  const { title, description } = JSON.parse(event.body) as ITicket;

  const record: ITicket = {
    id: uuid(),
    title,
    description,
    createOn: new Date().toISOString(),
    resolved: false,
  };

  const command = new PutCommand({
    Item: record,
    TableName: tableName,
  });

  const dbClient = getDbClient();
  await dbClient.send(command);

  const response = {
    statusCode: 201,
    body: JSON.stringify(record),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
