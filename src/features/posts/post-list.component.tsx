import { useAppSelector } from "../../app/hooks";
import PostsExcerpt from "./post-excerpt.component";
import { getPostsError, getPostsStatus, selectPostIds } from "./postSlices";

const PostList = () => {
  const orderedPostsIds = useAppSelector(selectPostIds);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);

  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    content = orderedPostsIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{postsError}</p>;
  }

  return <section>{content}</section>;
};

export default PostList;
