export type RegisterUserData = {
  username: string;
  email: string;
  password: string;
  bio?: string;
};

export type LoginUserData = {
  email: string;
  password: string;
};

export type CreateTweetData = {
  userId: string;
  content: string;
};

export type NotificationData = {
  userName: string;
  type: string;
  referenceId: string;
};

export type TweetEvent = {
  tweetId: string;
  userId: string;
  content: string;
};
