import React, { FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import {
  useUpdatePostMutation,
  useDeletePostMutation,
  selectPostById,
} from "./postSlices";
import { PostInterface } from "./types";

const EditPostForm = () => {
  const navigate = useNavigate();
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const { postId = "" } = useParams();
  const post = useAppSelector((state) => selectPostById(state, postId));
  const users = useAppSelector(selectAllUsers);

  const [title, setTitle] = useState<string>(post?.title || "");
  const [content, setContent] = useState<string>(post?.body || "");
  const [userId, setUserId] = useState<string>(post?.userId || "");

  const onTitleChanged = (e: FormEvent<HTMLInputElement>): void =>
    setTitle(e.currentTarget.value);

  const onContentChanged = (e: FormEvent<HTMLTextAreaElement>) =>
    setContent(e.currentTarget.value);

  const onAuthorChanged = (e: FormEvent<HTMLSelectElement>) =>
    setUserId(e.currentTarget.value);

  const isCanSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSaveEditClicked = async () => {
    if (!isCanSave) return;

    try {
      const params = {
        ...post,
        title,
        userId,
        body: content,
        id: post?.id || "",
        reactions: post?.reactions,
      } as PostInterface;

      await updatePost(params).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate(`/post/${postId}`);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onDeleteClicked = async () => {
    try {
      await deletePost(postId).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author: </label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" disabled={!isCanSave} onClick={onSaveEditClicked}>
          {isLoading ? "Loading..." : "Save Post"}
        </button>
        <button
          type="button"
          className="deleteButton"
          disabled={!isCanSave}
          onClick={onDeleteClicked}
        >
          {isLoading ? "Loading..." : "Delete Post"}
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
