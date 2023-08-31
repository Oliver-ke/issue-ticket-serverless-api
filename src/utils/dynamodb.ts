import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient as DocClient,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  PutCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

export const getDbClient = () => {
  const dbclient = new DynamoDBClient({});
  const docClient = DocClient.from(dbclient);
  return docClient;
};
