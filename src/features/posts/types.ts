export interface InitialPostInterface {
  posts: PostInterface[];
  status: StatusType;
  error?: string | null;
}

export interface PostInterface {
  id: string;
  title: string;
  body: string;
  userId?: number;
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
