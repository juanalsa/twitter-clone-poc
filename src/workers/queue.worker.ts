import { createNotification } from '../utils/db';
import { NotificationData, TweetEvent } from '../utils/types';

export interface Env {
  DATABASE_URL: string;
}

export const processQueue = async (
  batch: MessageBatch<TweetEvent>,
  env: Env
) => {
  for (const message of batch.messages) {
    const { tweetId, userId, content } = message.body;
    console.log(`Processing tweet ${tweetId}: "${content}"`);

    // Simulate logic to notify users when a user mentions someone in the tweet
    const mentions = content.match(/@\w+/g);

    if (mentions) {
      for (const mention of mentions) {
        const userName = mention.substring(1);
        const notificationData: NotificationData = {
          userName,
          type: 'mention',
          referenceId: tweetId,
        };

        // Send notification to the mentioned user
        await createNotification(env.DATABASE_URL, notificationData);
        console.log(`Sent mention notification to ${userName}`);
      }
    }

    // Mark the message as processed
    message.ack();
  }
};
