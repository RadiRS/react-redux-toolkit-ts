import { FormEvent, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addNewPost } from "./postSlices";
import { selectAllUsers } from "../users/usersSlice";
import { StatusType } from "./types";

type Props = {};

const AddPostForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState<StatusType>("idle");

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: FormEvent<HTMLInputElement>): void =>
    setTitle(e.currentTarget.value);

  const onContentChanged = (e: FormEvent<HTMLInputElement>) =>
    setContent(e.currentTarget.value);

  const onAuthorChanged = (e: FormEvent<HTMLSelectElement>) =>
    setUserId(e.currentTarget.value);

  const isCanSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = async () => {
    if (!isCanSave) return;

    try {
      setAddRequestStatus("loading");

      const params = { title, body: content, userId };
      dispatch(addNewPost(params)).unwrap();
      setTitle("");
      setContent("");
      setUserId("");
    } catch (error) {
      console.log("Failed to save the post with error:", error);
    } finally {
      setAddRequestStatus("idle");
    }

    // dispatch(addNewPost(title, content, userId));
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
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
        <input
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" disabled={!isCanSave} onClick={onSavePostClicked}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
