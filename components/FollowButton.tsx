'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';

import { followUser, isFollowingUser, unfollowUser } from '@/lib/action';

interface FollowButtonProps {
  followId: number;
}
const FollowButton: React.FC<FollowButtonProps> = async ({ followId }) => {
  const [isPending, startTransition] = useTransition();
  const isFollowing = await isFollowingUser(followId);
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(followId);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(followId);
        toast.success('Followed successfully');
      }
    } catch (error: any) {
      toast.success(error);
    }
  };

  return (
    <button
      className={`rounded px-3 py-1 ${isFollowing ? 'bg-zinc-100 text-red-500' : 'bg-gray-200 text-black'}`}
      disabled={isPending}
      onClick={handleFollow}
    >
      {isPending ? 'Processing...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
