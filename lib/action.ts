'use server';
import { join } from 'path';
import { stat, mkdir, writeFile } from 'fs/promises';

import mime from 'mime';
import { AuthError, CredentialsSignin } from 'next-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  bioSchema,
  commentSchema,
  createPostSchema,
  passwordSchema,
  pictureSchema,
  signUpSchema,
  usernameSchema,
} from './zod';

import {
  CommentState,
  Post,
  PostState,
  SettingsState,
  SigninPropsState,
  State,
} from '@/types/definitions';
import prisma from '@/db/prisma';
import { signIn, auth } from '@/auth';
import { comparePW, hashPW } from '@/utils/authTools';

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

export async function getUserFromDbWithId(id: number) {
  try {
    const user = await prisma?.user.findUnique({
      where: { id },
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

async function savePic(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fs = require('fs');
  const filePath = `/uploads/${file.name}`;

  fs.writeFileSync(`./public${filePath}`, buffer);

  return filePath;
}

async function uploadPic(image: File) {
  const buffer = Buffer.from(await image.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-')}`;

  const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      // If the directory doesn't exist (ENOENT : Error No Entry), create one
      await mkdir(uploadDir, { recursive: true });
    } else {
      return null;
    }
  }
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${image.name.replace(
    /\.[^/.]+$/,
    '',
  )}-${uniqueSuffix}.${mime.getExtension(image.type)}`;

  await writeFile(`${uploadDir}/${filename}`, buffer);

  const fileUrl = `${relativeUploadDir}/${filename}`;

  return fileUrl;
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
  const path = await uploadPic(imageUrl);

  if (!path) {
    throw new Error('Can not save file');
  }
  try {
    const userId = await getUserId();

    await prisma.post.create({
      data: {
        imageUrl: path,
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
  try {
    const posts = await prisma.post.findMany({
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

    return posts as unknown as Post[];
  } catch (error: any) {
    throw new Error(`Failed to fetch posts.${error.message}`);
  }
}

export async function isPostLiked(postId: number) {
  try {
    const userId = await getUserId();

    const like = await prisma.like.findFirst({
      where: {
        userId: userId,
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

export async function followUser(followId: number) {
  try {
    const userId = await getUserId();
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          connect: { id: followId },
        },
      },
    });

    revalidatePath('dashboard');

    return user;
  } catch (error) {
    throw new Error('Error following user');
  }
}
export async function isFollowingUser(followId: number): Promise<boolean> {
  try {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          where: { id: followId },
        },
      },
    });

    revalidatePath('dashboard');

    return (user?.following?.length ?? 0) > 0;
  } catch (error) {
    return false;
  }
}
export async function unfollowUser(followId: number) {
  try {
    const userId = await getUserId();
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          disconnect: { id: followId },
        },
      },
    });

    revalidatePath('dashboard');

    return user;
  } catch (error) {
    throw new Error('Error unfollowing user');
  }
}
export async function addComment(state: CommentState, formData: FormData): Promise<CommentState> {
  const validatedFields = commentSchema.safeParse({
    postId: formData.get('postId'),
    comment: formData.get('comment'),
  });

  if (!validatedFields.success) {
    return {
      ...state,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add Comment.',
    };
  }

  const { postId, comment } = validatedFields.data;

  try {
    const userId = await getUserId();

    await prisma.comment.create({
      data: {
        userId: userId,
        postId: Number(postId),
        text: comment as string,
      },
    });

    revalidatePath('/dashboard');

    return { ...state, message: 'Comment added successfully', errors: {} };
  } catch (error: any) {
    return { message: error.message, errors: {} };
  }
}

export async function getComments(postId: number) {
  return await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
  });
}

export async function updateUser(state: SettingsState, formData: FormData): Promise<SettingsState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const newpassword = formData.get('newpassword') as string;
  const bio = formData.get('bio') as string;
  const picture = formData.get('picture') as File;

  const userId = await getUserId();
  const user = await getUserFromDbWithId(userId);

  try {
    if (username !== user?.username) {
      const usernameValidatedField = usernameSchema.safeParse({
        username: formData.get('username'),
      });

      if (!usernameValidatedField.success) {
        return {
          errors: usernameValidatedField.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Username.',
        };
      }
      const { username } = usernameValidatedField.data;

      await prisma.user.update({
        where: { id: userId },
        data: { username },
      });

      // return { message: 'Username updated successfully', errors: {} };
    }

    if (bio !== user?.bio) {
      const bioValidatedField = bioSchema.safeParse({
        bio: formData.get('bio'),
      });

      if (!bioValidatedField.success) {
        return {
          errors: bioValidatedField.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Bio.',
        };
      }
      const { bio } = bioValidatedField.data;

      await prisma.user.update({
        where: { id: userId },
        data: { bio },
      });

      // return { message: 'Bio updated successfully', errors: {} };
    }

    if (picture) {
      const pictureValidatedField = pictureSchema.safeParse({
        picture: formData.get('picture'),
      });

      if (!pictureValidatedField.success) {
        return {
          errors: pictureValidatedField.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Picture.',
        };
      }
      const { picture } = pictureValidatedField.data;

      const path = await uploadPic(picture);

      if (!path) {
        throw new Error('Can not save file');
      }

      await prisma.user.update({
        where: { id: userId },
        data: { picture: path },
      });

      // return { message: 'Picture updated successfully', errors: {} };
    }

    if (password && newpassword) {
      const passwordValidatedField = passwordSchema.safeParse({
        password: formData.get('password'),
        newpassword: formData.get('newpassword'),
      });

      if (!passwordValidatedField.success) {
        return {
          errors: passwordValidatedField.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update New Password.',
        };
      }
      const { password, newpassword } = passwordValidatedField.data;

      if (!user) {
        throw new Error('User not found');
      }

      const passwordsMatch = await comparePW(password, user?.password);

      if (!passwordsMatch) {
        throw new Error('Your Password dose not match');
      }
      const hashedNewPassword = await hashPW(newpassword);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      // return { message: 'New password updated successfully', errors: {} };
    }
    revalidatePath('/settings');

    return { message: 'UserInfo Update successfully!', errors: {} };
  } catch (error: any) {
    return { message: error.message, errors: {} };
  }
}

export async function userActivities() {
  const userId = await getUserId();
  const userPost = await prisma.post.findMany({
    where: {
      userId: userId,
    },
  });

  return userPost;
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
