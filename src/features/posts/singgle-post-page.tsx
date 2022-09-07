import { selectPostById } from "./postSlices";

import { useAppSelector } from "../../app/hooks";
import PostAuthor from "./post-author.component";
import TimeAgo from "./time-ago.component";
import ReactButton from "./react-button.component";

interface SinglePostPageProps {}

const SinglePostPage = (props: SinglePostPageProps) => {
  const postId = "";
  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactButton post={post} />
    </article>
  );
};

export default SinglePostPage;
