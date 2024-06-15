'use client';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

import { CardPostProps } from '@/types/definitions';

const CommentButton = ({ post }: CardPostProps) => {
  const handleClick = () => {
    const commentInput = document.getElementById(`comment-input-${post.id}`) as HTMLInputElement;

    if (commentInput) {
      commentInput.focus();
    }
  };

  return (
    <button onClick={handleClick}>
      <ChatBubbleLeftIcon
        className="my-2 w-6 hover:fill-zinc-300"
        fill={!!post.comments?.length ? 'gray' : 'none'}
      />
    </button>
  );
};

export default CommentButton;
