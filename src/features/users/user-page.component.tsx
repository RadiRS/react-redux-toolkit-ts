import { Link, useParams } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectPostByUser } from "../posts/postSlices";
import { selectUserById } from "./usersSlice";

const UserPage = () => {
  const { userId = "" } = useParams<{ userId: string }>();

  const user = useAppSelector((state) => selectUserById(state, userId));

  const postsForUser = useAppSelector((state) => {
    return selectPostByUser(state, userId);
  });

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
