'use server';
import { join } from 'path';
import { writeFile } from 'fs/promises';

import { AuthError, CredentialsSignin } from 'next-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { createPostSchema, signUpSchema } from './zod';

import { Post, PostState, SigninPropsState, State } from '@/types/definitions';
import prisma from '@/db/prisma';
import { signIn, auth } from '@/auth';
import { hashPW } from '@/utils/authTools';

export async function getUserFromDb(email: string) {
  try {
    const user = await prisma?.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user.${error.message}`);
  }
}

export async function getUserId() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      throw new Error('User not authenticated');
    }
    const userId = session.user.id;

    return userId;
  } catch (error) {
    throw new Error(`Can not get user from session, ${error}`);
  }
}

export async function authenticate(
  state: SigninPropsState,
  formData: FormData,
): Promise<SigninPropsState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
    });

    return { ...state, message: 'Sign in successful' };
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (CredentialsSignin.type) {
        case 'CredentialsSignin':
          return {
            ...state,
            emailError: 'Email or Password is incorrect.',
            passwordError: 'Password is incorrect.',
          };
        default:
          return {
            ...state,
            generalError: `Something went wrong. ${error.message}`,
          };
      }
    }

    return { ...state, message: error.message, errors: {} };
  }
}

export async function signUp(state: State, formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Sign up.',
    };
  }
  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPW(password);

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    redirect('/dashboard');
  } catch (error: any) {
    return { message: error.message, errors: {} };
  }
}

const saveFile = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join(process.cwd(), 'public', 'uploads', file.name);

  await writeFile(path, buffer);

  return path;
};

export async function createPost(state: PostState, formData: FormData) {
  const validatedFields = createPostSchema.safeParse({
    imageUrl: formData.get('imageUrl'),
    caption: formData.get('caption'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Post.',
    };
  }

  const { imageUrl, caption } = validatedFields.data;
  const path = await saveFile(imageUrl);

  if (!path) {
    throw new Error('Can not save file');
  }
  try {
    const userId = await getUserId();

    await prisma.post.create({
      data: {
        imageUrl: '/uploads/' + imageUrl.name,
        caption,
        userId: Number(userId),
      },
    });
  } catch (error: any) {
    return { message: error.message, errors: {} };
  }
  redirect('/dashboard');
}

export async function getPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function isPostLiked(postId: number) {
  try {
    const userId = await getUserId();

    const like = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    revalidatePath('/dashboard');
    if (!like?.id) {
      return { success: false };
    } else return { success: true };
  } catch (error) {
    return { success: false, message: 'Error checking like status' };
  }
}

export async function likePost(postId: number) {
  try {
    const userId = await getUserId();

    await prisma.like.create({
      data: {
        userId: userId,
        postId,
      },
    });

    revalidatePath('/dashboard');

    return { success: true, message: 'Post liked successfully!' };
  } catch (error) {
    return { success: false, message: 'Error liking post' };
  }
}

export async function unlikePost(postId: number) {
  try {
    const userId = await getUserId();

    await prisma.like.deleteMany({
      where: {
        userId: userId,
        postId,
      },
    });

    revalidatePath('/dashboard');

    return { success: true, message: 'Post unliked successfully!' };
  } catch (error) {
    return { success: false, message: 'Error unliking post' };
  }
}

export async function followUser(userId: number, followId: number) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          connect: { id: followId },
        },
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error following user');
  }
}

export async function unfollowUser(userId: number, followId: number) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          disconnect: { id: followId },
        },
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error unfollowing user');
  }
}
export async function addComment(postId: number, text: string) {
  const userId = await getUserId();

  return await prisma.comment.create({
    data: {
      userId: userId,
      postId,
      text,
    },
  });
}
export async function getComments(postId: number) {
  return await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
  });
}

/* export async function sendMessage(senderId: number, receiverId: number, content: string) {
  return await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
  });
}

export async function getMessages(userId: number) {
  return await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });
} */
