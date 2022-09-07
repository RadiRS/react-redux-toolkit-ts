import React from "react";
import { Link, useParams } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectAllPosts } from "../posts/postSlices";
import { selectUserById } from "./usersSlice";

type Props = {};

const UserPage = (props: Props) => {
  const { userId = "" } = useParams<{ userId: string }>();

  const user = useAppSelector((state) => selectUserById(state, userId));

  const postsForUser = useAppSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => Number(post.userId) === Number(userId));
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
