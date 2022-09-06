import { FormEvent, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { postAdded } from "./postSlices";
import { selectAllUsers } from "../users/usersSlice";

type Props = {};

const AddPostForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: FormEvent<HTMLInputElement>): void =>
    setTitle(e.currentTarget.value);

  const onContentChanged = (e: FormEvent<HTMLInputElement>) =>
    setContent(e.currentTarget.value);

  const onAuthorChanged = (e: FormEvent<HTMLSelectElement>) =>
    setUserId(e.currentTarget.value);

  const isCanSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const onSavePostClicked = () => {
    if (!isCanSave) return;

    dispatch(postAdded(title, content, userId));
    setTitle("");
    setContent("");
    setUserId("");
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
        <label htmlFor="postCotent">Post Cotent:</label>
        <input
          type="text"
          id="postCotent"
          name="postCotent"
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
