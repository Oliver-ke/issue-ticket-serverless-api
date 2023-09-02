import { SNSClient } from "@aws-sdk/client-sns";

export const getSNSClient = () => {
  const client = new SNSClient();
  return client;
};
