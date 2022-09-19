import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { useAddNewPostMutation } from "./postSlices";
import { selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
  const navigate = useNavigate();
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: FormEvent<HTMLInputElement>): void =>
    setTitle(e.currentTarget.value);

  const onContentChanged = (e: FormEvent<HTMLTextAreaElement>) =>
    setContent(e.currentTarget.value);

  const onAuthorChanged = (e: FormEvent<HTMLSelectElement>) =>
    setUserId(e.currentTarget.value);

  const isCanSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (!isCanSave) return;

    try {
      const params = { title, body: content, userId };
      await addNewPost(params).unwrap();
      setTitle("");
      setContent("");
      setUserId("");

      navigate("/");
    } catch (error) {
      console.log("Failed to save the post with error:", error);
    }
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
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" disabled={!isCanSave} onClick={onSavePostClicked}>
          {isLoading ? "Loading..." : "Save Post"}
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
