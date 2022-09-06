import { useAppDispatch } from "../../app/hooks";
import { reactionAdded } from "./postSlices";
import { PostState, ReactionState } from "./types";

interface ReactButtonsProps {
  post: PostState;
}

const reactionEmoji: Record<keyof ReactionState, string> = {
  thumbsUp: "👍",
  wow: "😲",
  hearth: "❤️",
  rocket: "🚀",
  coffee: "☕️",
};

const ReactButtons = ({ post }: ReactButtonsProps) => {
  const dispatch = useAppDispatch();

  const onPressReact = (reactName: keyof ReactionState) => {
    dispatch(reactionAdded({ postId: post.id, reaction: reactName }));
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => onPressReact(name as keyof ReactionState)}
      >
        {emoji} {post.reactions[name as keyof ReactionState]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactButtons;
