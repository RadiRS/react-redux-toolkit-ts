import React from "react";

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
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactButton post={post} />
    </article>
  );
};

export default PostsExcerpt;
