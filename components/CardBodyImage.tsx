'use client';

import NextImage from 'next/image';
import { Image } from '@nextui-org/react';

import { CardPostProps } from '@/types/definitions';

const CardBodyImage = ({ post }: CardPostProps) => {
  return (
    <Image
      isBlurred
      priority
      alt={post.caption}
      as={NextImage}
      className="rounded-xl object-cover object-center"
      height={500}
      src={post.imageUrl}
      width={500}
      //   onLoad={(result) => console.log('Image loaded:', result)}
      //   onError={(error) => console.log('Image load error:', error, post.imageUrl)}
    />
  );
};

export default CardBodyImage;
