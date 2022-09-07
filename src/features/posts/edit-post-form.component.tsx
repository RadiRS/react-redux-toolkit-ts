import React, { FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { selectPostById, updatePost, deletePost } from "./postSlices";
import { StatusType } from "./types";

type Props = {};

const EditPostForm = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { postId = "" } = useParams();
  const post = useAppSelector((state) => selectPostById(state, postId));
  const users = useAppSelector(selectAllUsers);

  const [title, setTitle] = useState<string>(post?.title || "");
  const [content, setContent] = useState<string>(post?.body || "");
  const [userId, setUserId] = useState<string>(post?.userId || "");
  const [requestStatus, setRequestStatus] = useState<StatusType>("idle");

  const onTitleChanged = (e: FormEvent<HTMLInputElement>): void =>
    setTitle(e.currentTarget.value);

  const onContentChanged = (e: FormEvent<HTMLTextAreaElement>) =>
    setContent(e.currentTarget.value);

  const onAuthorChanged = (e: FormEvent<HTMLSelectElement>) =>
    setUserId(e.currentTarget.value);

  const isCanSave =
    [title, content, userId].every(Boolean) && requestStatus === "idle";

  const onSaveEditClicked = async () => {
    if (!isCanSave) return;

    try {
      setRequestStatus("loading");

      const params = {
        id: post?.id || "",
        title,
        body: content,
        userId,
        reactions: post?.reactions,
      };

      await dispatch(updatePost(params)).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate(`/post/${postId}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      setRequestStatus("idle");
    }
  };

  const onDeleteClicked = async () => {
    try {
      setRequestStatus("loading");

      await dispatch(deletePost(postId));

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (error) {
      console.log("error", error);
    } finally {
      setRequestStatus("idle");
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
          {requestStatus === "loading" ? "Loading..." : "Save Post"}
        </button>
        <button
          type="button"
          className="deleteButton"
          disabled={!isCanSave}
          onClick={onDeleteClicked}
        >
          {requestStatus === "loading" ? "Loading..." : "Delete Post"}
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
