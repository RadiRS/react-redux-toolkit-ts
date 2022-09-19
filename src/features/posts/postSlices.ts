import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

import {
  ReactionInterface,
  PostInterface,
  InitialPostInterface,
} from "./types";

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

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<PostInterface>, void>({
      query: () => "/posts",
      transformResponse: (responseData: PostInterface[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post.reactions) {
            post.reactions = initialReaction;
          }

          return post;
        });

        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result: EntityState<PostInterface> | undefined) =>
        result
          ? [
              ...result?.ids.map((id) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getPostsByUserId: builder.query<EntityState<PostInterface>, any>({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData: PostInterface[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post.reactions) {
            post.reactions = initialReaction;
          }

          return post;
        });

        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result: EntityState<PostInterface> | undefined) =>
        result
          ? [
              ...result?.ids.map((id) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    addNewPost: builder.mutation({
      query: (initialPost: {
        title: string;
        body: string;
        userId: string;
      }) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
          reactions: initialReaction,
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost: PostInterface) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: (id: string) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),
    addReaction: builder.mutation({
      query: ({
        postId,
        reactions,
      }: {
        postId: string;
        reactions: ReactionInterface;
      }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              // the `draft` is Immer wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

// return the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postResult) => postResult.data // normalized state object with ids & entities
);

//* getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  //! Pass in a selector that return the posts slice of state
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);
