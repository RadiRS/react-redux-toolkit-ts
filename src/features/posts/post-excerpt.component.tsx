import { Link } from "react-router-dom";

import PostAuthor from "./post-author.component";
import TimeAgo from "./time-ago.component";
import ReactButton from "./react-button.component";
import { PostInterface } from "./types";

interface PostExcerptProps {
  post: PostInterface;
}

const PostsExcerpt = ({ post }: PostExcerptProps) => {
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactButton post={post} />
    </article>
  );
};

export default PostsExcerpt;
