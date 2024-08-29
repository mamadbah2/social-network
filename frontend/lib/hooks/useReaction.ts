import { FormEvent, useState } from "react";
import usePostData from "./usepost";

type ReactionOptions = {
  entityId: number;
  reactionType: "post" | "comment";
  isLike: boolean;
};

export const useReaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReactionSubmit = async (
    e: FormEvent<HTMLButtonElement>,
    { entityId, reactionType, isLike }: ReactionOptions
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("id_entity", String(entityId));
    formData.append("reaction_type", reactionType);

    const endpoint = isLike ? "/like" : "/dislike";
    const [resp, err] = await usePostData(endpoint, formData, false);

    setLoading(false);

    if (err) {
      setError(`Failed to submit ${isLike ? "like" : "dislike"}.`);
    }
  };

  return { handleReactionSubmit, loading, error };
};
