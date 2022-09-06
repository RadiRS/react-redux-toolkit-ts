import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";

import { RootState } from "../../app/store";
import { PostState, ReactionState } from "./types";

const initialReaction: ReactionState = {
  thumbsUp: 0,
  wow: 0,
  hearth: 0,
  rocket: 0,
  coffee: 0,
};

const initialState: PostState[] = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard good things.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: initialReaction,
  },
  {
    id: "2",
    title: "Learning React Native",
    content: "This is cool framework",
    date: sub(new Date(), { minutes: 20 }).toISOString(),
    reactions: initialReaction,
  },
];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<PostState>) => {
        state.push(action.payload);
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: initialReaction,
          },
        };
      },
    },
    reactionAdded(
      state,
      // action: { payload: { postId: string; reaction: keyof ReactionState } }
      action: PayloadAction<{ postId: string; reaction: keyof ReactionState }>
    ) {
      const { postId, reaction } = action.payload;

      const existingPost = state.find((post) => post.id === postId);

      if (!existingPost) return;

      existingPost.reactions[reaction]++;
    },
  },
});

export const selectAllPosts = (state: RootState) => state.posts;

export const { postAdded, reactionAdded } = postSlice.actions;

export default postSlice.reducer;
