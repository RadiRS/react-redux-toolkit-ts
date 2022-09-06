export interface PostState {
  id: string;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reactions: ReactionState;
}

// export type reaction = "thumbsUp" | "wow" | "hearth" | "rocket" | "coffee";

export interface ReactionState {
  thumbsUp: number;
  wow: number;
  hearth: number;
  rocket: number;
  coffee: number;
}
