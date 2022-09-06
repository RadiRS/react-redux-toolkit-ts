import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

import { RootState } from "../../app/store";
import {
  ReactionInterface,
  PostInterface,
  InitialPostInterface,
} from "./types";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const initialReaction: ReactionInterface = {
  thumbsUp: 0,
  wow: 0,
  hearth: 0,
  rocket: 0,
  coffee: 0,
};

const initialState: InitialPostInterface = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get(POSTS_URL);
  return res.data;
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<PostInterface>) => {
        state.posts.push(action.payload);
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            body: content,
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
      action: PayloadAction<{
        postId: string;
        reaction: keyof ReactionInterface;
      }>
    ) {
      const { postId, reaction } = action.payload;

      const existingPost = state.posts.find((post) => post.id === postId);

      if (!existingPost) return;

      existingPost.reactions[reaction]++;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;

        const loadedPosts: PostInterface[] = action.payload.map(
          (post: PostInterface) => {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
            post.reactions = initialReaction;

            return post;
          }
        );

        // add any fetched posts to the array state
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const { postAdded, reactionAdded } = postSlice.actions;

export default postSlice.reducer;
