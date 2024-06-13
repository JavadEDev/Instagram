import { Card, CardHeader, CardBody, Image, Divider, Avatar } from '@nextui-org/react';
import { cn } from '@nextui-org/theme';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

import { MotionDiv } from './MotionDiv';
import LikeButton from './LikeButton';

import { CardPostProps } from '@/types/definitions';

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PostCard = ({ post }: CardPostProps) => {
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
        className="max-w-[610px] border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
      >
        <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
          <small className="flex items-center gap-2">
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src={post.user?.picture ? post.user?.picture : ''}
            />
            {post.user?.username}
            <span>.</span>
            <h5>Follow</h5>
          </small>
          {/* <h4 className="font-bold text-large">Frontend Radio</h4> */}
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt={post.caption}
            className="rounded-xl object-cover"
            src={post.imageUrl}
            width="100%"
          />
          <div className="flex justify-start">
            <LikeButton post={post} />
            <ChatBubbleLeftIcon
              className={cn(
                `m-2 w-6 hover:fill-lime-500`,
                post.likes && '[&>path]:stroke-transparent',
              )}
              fill={post.likes ? 'black' : 'none'}
            />
          </div>
          <p className="m-2 text-default-500">{post.caption}</p>
          <small>{post.likes?.length} Likes</small>
          <Divider className="my-2" />
          <small>Comments:</small>
          <div>
            {post.comments?.map((comment) => (
              <div key={comment.id}>
                <p>
                  <strong>{comment.user.username}:</strong> {comment.text}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </MotionDiv>
  );
};

export default PostCard;
