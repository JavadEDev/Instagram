import { Card, CardHeader, CardBody, Divider, Avatar } from '@nextui-org/react';
import { cn } from '@nextui-org/theme';

import { MotionDiv } from './MotionDiv';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import CommentButton from './CommentButton';
import FollowButton from './FollowButton';
import CardBodyImage from './CardBodyImage';

import { CardPostProps } from '@/types/definitions';
import { isFollowingUser } from '@/lib/action';

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PostCard = async ({ post }: CardPostProps) => {
  const userIdPost = post.user?.id;
  let isFollowing = false;

  if (userIdPost) {
    isFollowing = await isFollowingUser(userIdPost);
  }

  return (
    <MotionDiv
      animate="visible"
      className="relative w-full max-w-sm rounded"
      initial="hidden"
      transition={{
        delay: post.id * 0.35,
        ease: 'easeInOut',
        duration: 0.5,
      }}
      variants={variants}
      viewport={{ amount: 0 }}
    >
      <Card
        isBlurred
        className="max-h-[610px] border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
      >
        <CardHeader className="ml-4 flex-col items-start p-2">
          <small className="flex items-center gap-2">
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src={post.user?.picture ? post.user?.picture : ''}
            />
            {post.user?.username}
            <span className="mb-2">
              <b className="text-xl">.</b>
            </span>
            {post.user?.id && (
              <h5>{<FollowButton followId={post.user.id} isFollowing={isFollowing} />}</h5>
            )}
          </small>
        </CardHeader>
        <CardBody className="overflow-visible">
          <CardBodyImage post={post} />
          <div className="flex space-x-2 pt-2">
            <LikeButton post={post} />
            <CommentButton post={post} />
          </div>
          <small className="pl-3">
            <span className={cn(`font-light`, !!post.likes?.length && 'font-semibold')}>
              {post.likes?.length} Likes
            </span>
          </small>
          <p className="truncate p-3">
            <span className="mr-1 font-semibold">{post.user?.username}</span>
            {post.caption}
          </p>
          <Divider />
          <CommentSection post={post} />
        </CardBody>
      </Card>
    </MotionDiv>
  );
};

export default PostCard;
