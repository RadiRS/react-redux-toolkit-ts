import { nanoid } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import PostsExcerpt from "./post-excerpt.component";
import { selectAllPosts, getPostsError, getPostsStatus } from "./postSlices";

type Props = {};

const PostList = (props: Props) => {
  const posts = useAppSelector(selectAllPosts);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);

  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => (
      <PostsExcerpt key={post.id + nanoid()} post={post} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{postsError}</p>;
  }

  return <section>{content}</section>;
};

export default PostList;
