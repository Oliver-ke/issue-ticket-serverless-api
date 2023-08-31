import "source-map-support/register";
import { SNSEvent } from "aws-lambda";

export const messageSlackHandler = async (event: SNSEvent) => {
  console.info("Received from SNS:", event);
};
