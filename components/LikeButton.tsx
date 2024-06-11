"use client";
import { HeartIcon } from "@heroicons/react/24/outline";
import { cn } from "@nextui-org/theme";

import { CardPostProps } from "@/types/definitions";
import { likePost } from "@/lib/action";

const LikeButton = ({ post }: CardPostProps) => {
  return (
    <div>
      <button
        onClick={() => {
          likePost(post.id);
        }}
      >
        <HeartIcon
          className={cn(
            `w-6 ml-2 hover:fill-red-200`,
            post.likes && "[&>path]:stroke-transparent",
          )}
          fill={post.likes ? "red" : "none"}
        />
      </button>
    </div>
  );
};

export default LikeButton;
