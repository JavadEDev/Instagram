export type State = {
  errors: {
    email?: string[];
    password?: string[];
  };
  message: string | null;
};
export interface SigninPropsState {
  message?: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
  emailError?: string;
  passwordError?: string;
  generalError?: string;
}
export interface CardPostProps {
  post: Post;
}
export interface User {
  id: number;
  username?: string;
  email: string;
  password: string;
  picture?: string;
  bio?: string;
  posts?: Post[];
  followers?: User[];
  following?: User[];
  likes?: Like[];
  comments?: Comment[];
  sessions?: Session[];
  accounts?: Account[];
}
export type PostState = {
  errors: {
    imageUrl?: string[];
    caption?: string[];
    userId?: number;
  };
  message: string | null;
};

export type CommentState = {
  errors: {
    postId?: string[];
    comment?: string[];
  };
  message: string | null;
};
export interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  userId: number;
  user?: User;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  user: User;
  post: Post;
  createdAt: Date;
}

export interface Comment {
  id: number;
  text: string;
  userId: number;
  postId: number;
  createdAt: Date;
  user?: User;
  post: Post;
}
export interface Session {
  id: number;
  sessionId: string;
  userId: number;
  user: User;
  expiresAt: Date;
  createdAt: Date;
}
export interface Account {
  id: number;
  userId: number;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: User;
}
