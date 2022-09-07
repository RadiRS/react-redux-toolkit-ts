import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
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

const postsAdapter = createEntityAdapter<PostInterface>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState<InitialPostInterface>({
  status: "idle",
  error: "",
  count: 0,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get(POSTS_URL);
  return res.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: { title: string; body: string; userId: string }) => {
    try {
      const res = await axios.post(POSTS_URL, initialPost);
      return res.data;
    } catch (error) {
      console.log("error", error);
      // return error.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: {
    id: string;
    body: string;
    userId: string;
    title: string;
    reactions?: ReactionInterface;
  }) => {
    const { id } = initialPost;
    try {
      const res = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return res.data;
    } catch (error) {
      // console.log("error", error);
      return initialPost; //! only for testing
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string) => {
    try {
      const res = await axios.delete(`${POSTS_URL}/${id}`);
      if (res.status === 200) return id;
      return `${res.status}: ${res.statusText}`;
    } catch (error) {
      console.log("error", error);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(
      state,
      // action: { payload: { postId: string; reaction: keyof ReactionState } }
      action: PayloadAction<{
        postId: string;
        reaction: keyof ReactionInterface;
      }>
    ) {
      const { postId, reaction } = action.payload;

      const existingPost = state.entities[postId];

      if (!existingPost) return;

      existingPost.reactions[reaction]++;
    },
    increaseCount(state) {
      state.count = state.count + 1;
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
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(
        addNewPost.fulfilled,
        (state, action: PayloadAction<PostInterface>) => {
          action.payload.date = new Date().toISOString();
          action.payload.reactions = initialReaction;

          postsAdapter.addOne(state, action.payload);
        }
      )
      .addCase(
        updatePost.fulfilled,
        (state, action: PayloadAction<PostInterface>) => {
          if (!action.payload.id) {
            console.log("Update could not complete");
            console.log("Payload: ", action.payload);
            return;
          }

          action.payload.date = new Date().toISOString();
          postsAdapter.upsertOne(state, action.payload);
        }
      )
      .addCase(deletePost.fulfilled, (state, action) => {
        const id = action.payload;

        if (!id) {
          console.log("Delete could not complete");
          console.log("action.payload", action.payload);
          return;
        }

        postsAdapter.removeOne(state, id);
      });
  },
});

//* getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  //! Pass in a selector that return the posts slice of state
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const getCount = (state: RootState) => state.posts.count;

export const selectPostByUser = createSelector(
  [selectAllPosts, (_, userId: string) => userId],
  (posts, userId) =>
    posts.filter((post) => Number(post.userId) === Number(userId))
);

export const { reactionAdded, increaseCount } = postSlice.actions;

export default postSlice.reducer;
