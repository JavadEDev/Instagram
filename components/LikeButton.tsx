'use client';
import { HeartIcon } from '@heroicons/react/24/outline';
import { cn, divider } from '@nextui-org/theme';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { CardPostProps } from '@/types/definitions';
import { isPostLiked, likePost, unlikePost } from '@/lib/action';

const LikeButton = ({ post }: CardPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfLiked = async () => {
      const result = await isPostLiked(post.id);

      if (result.success) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
      setLoading(false);
    };

    checkIfLiked();
  }, [post.id, post.userId]);

  const handleLike = async () => {
    const result = await likePost(post.id);

    if (result.success) {
      setIsLiked(true);
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Error liking post');
    }
  };

  const handleUnlike = async () => {
    const result = await unlikePost(post.id);

    if (result.success) {
      setIsLiked(false);
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Error unliking post');
    }
  };

  return (
    <div>
      {loading ? (
        <HeartIcon className="w-6" />
      ) : (
        <button onClick={isLiked ? handleUnlike : handleLike}>
          <HeartIcon
            className={cn(`ml-2 w-6 hover:fill-red-500`, isLiked && '[&>path]:stroke-transparent')}
            fill={isLiked ? 'red' : 'none'}
          />
        </button>
      )}
    </div>
  );
};

export default LikeButton;
