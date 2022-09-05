import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { postAdded } from "./postSlices";

type Props = {};

const AddPostForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onTitleChanged = (e: FormEvent<HTMLInputElement>): void =>
    setTitle(e.currentTarget.value);

  const onContentChanged = (e: FormEvent<HTMLInputElement>) =>
    setContent(e.currentTarget.value);

  const onSavePostClicked = () => {
    if (!title || !content) return;

    dispatch(postAdded(title, content));
    setTitle("");
    setContent("");
  };

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
        <label htmlFor="postCotent">Post Cotent:</label>
        <input
          type="text"
          id="postCotent"
          name="postCotent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
