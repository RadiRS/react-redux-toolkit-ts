import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { Link } from "react-router-dom";

interface PostAuthorProps {
  userId?: string;
}

const PostAuthor = ({ userId }: PostAuthorProps) => {
  const users = useAppSelector(selectAllUsers);
  const author = users.find((user) => Number(user.id) === Number(userId));

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};

export default PostAuthor;
