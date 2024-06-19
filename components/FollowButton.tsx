'use client';

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';

import { followUser, unfollowUser } from '@/lib/action';

interface FollowButtonProps {
  followId: number;
  isFollowing: boolean;
}
const FollowButton: React.FC<FollowButtonProps> = async ({ followId, isFollowing }) => {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    try {
      if (following) {
        await unfollowUser(followId);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(followId);
        toast.success('Followed successfully');
      }
      setFollowing(!following);
    } catch (error: any) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <button
      className={`rounded px-3 py-1 ${isFollowing ? 'bg-zinc-100 text-red-500' : 'bg-gray-200 text-black'}`}
      disabled={isPending}
      onClick={() => startTransition(handleFollow)}
    >
      {isPending ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
