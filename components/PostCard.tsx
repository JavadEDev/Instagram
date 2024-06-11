import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Divider,
  Avatar,
} from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/24/outline";

import { MotionDiv } from "./MotionDiv";

import { CardPostProps, Post } from "@/types/definitions";
import LikeButton from "./LikeButton";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PostCard = ({ post }: CardPostProps) => {
  return (
    <MotionDiv
      animate="visible"
      className="max-w-sm rounded relative w-full"
      initial="hidden"
      transition={{
        delay: post.id * 0.35,
        ease: "easeInOut",
        duration: 0.5,
      }}
      variants={variants}
      viewport={{ amount: 0 }}
    >
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <small className="flex gap-2 items-center">
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src={post.user?.picture ? post.user?.picture : ""}
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
            className="object-cover rounded-xl"
            src={post.imageUrl}
            width="100%"
          />
          <div className="flex justify-start">
            <LikeButton post={post} />
            <ChatBubbleLeftIcon
              className={cn(
                `w-6 m-2 hover:fill-lime-500`,
                post.likes && "[&>path]:stroke-transparent",
              )}
              fill={post.likes ? "black" : "none"}
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
