import { useAppDispatch } from "../../app/hooks";
import { reactionAdded } from "./postSlices";
import { PostInterface, ReactionInterface } from "./types";

interface ReactButtonsProps {
  post: PostInterface;
}

const reactionEmoji: Record<keyof ReactionInterface, string> = {
  thumbsUp: "👍",
  wow: "😲",
  hearth: "❤️",
  rocket: "🚀",
  coffee: "☕️",
};

const ReactButtons = ({ post }: ReactButtonsProps) => {
  const dispatch = useAppDispatch();

  const onPressReact = (reactName: keyof ReactionInterface) => {
    dispatch(reactionAdded({ postId: post.id, reaction: reactName }));
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => onPressReact(name as keyof ReactionInterface)}
      >
        {emoji} {post.reactions[name as keyof ReactionInterface]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactButtons;
