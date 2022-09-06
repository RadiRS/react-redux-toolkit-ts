export interface PostState {
  id: string;
  title: string;
  content: string;
  userId?: string;
  date: string;
  reactions: ReactionState;
}

export interface ReactionState {
  thumbsUp: number;
  wow: number;
  hearth: number;
  rocket: number;
  coffee: number;
}
