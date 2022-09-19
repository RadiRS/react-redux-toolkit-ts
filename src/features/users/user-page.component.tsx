import { Link, useParams } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { useGetPostsByUserIdQuery } from "../posts/postSlices";
import { selectUserById } from "./usersSlice";

const UserPage = () => {
  const { userId = "" } = useParams<{ userId: string }>();

  const user = useAppSelector((state) => selectUserById(state, userId));

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  let content;

  if (isLoading) {
    content = <p>Loading..</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${entities[id]?.id}`}>{entities[id]?.title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error.toString()}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
