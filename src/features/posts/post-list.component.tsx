import { useAppSelector } from "../../app/hooks";
import PostsExcerpt from "./post-excerpt.component";
import { selectPostIds } from "./postSlices";

import { useGetPostsQuery } from "./postSlices";

const PostList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const orderedPostsIds = useAppSelector(selectPostIds);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = orderedPostsIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default PostList;
