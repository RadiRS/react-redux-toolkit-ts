export interface InitialPostInterface {
  // posts: PostInterface[];
  status: StatusType;
  error: string | undefined;
  count: number;
}

export interface PostInterface {
  id: string;
  title: string;
  body: string;
  userId?: string;
  date: string;
  reactions: ReactionInterface;
}

// export type reaction = "thumbsUp" | "wow" | "hearth" | "rocket" | "coffee";

export type StatusType = "idle" | "loading" | "succeeded" | "failed";

export interface ReactionInterface {
  thumbsUp: number;
  wow: number;
  hearth: number;
  rocket: number;
  coffee: number;
}
