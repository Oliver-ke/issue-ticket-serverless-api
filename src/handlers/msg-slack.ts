import "source-map-support/register";
import { SNSEvent } from "aws-lambda";
import { ITicket } from "../utils/types";
import axios from "axios";

const SLACK_WH =
  "https://hooks.slack.com/services/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";

export const messageSlackHandler = async (event: SNSEvent) => {
  console.info("Received from SNS:", event);

  const records = event.Records;
  for (const rec of records) {
    const { Sns } = rec;
    const message = JSON.parse(Sns.Message) as ITicket;

    // call slack
    try {
      const issueId = message.id.slice(0, 6).toUpperCase();
      const res = await axios.post(SLACK_WH, {
        text: `[${issueId}] - ${message.title} - ${message.description}`,
        icon_emoji: "🔧",
      });

      console.log("Message sent to slack", res.data);
    } catch (err) {
      console.error("Error calling slack", err);
    }
  }
};
