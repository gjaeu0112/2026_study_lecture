export type Role = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author?: User;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface DashboardStats {
  userCount: number;
  postCount: number;
  commentCount: number;
}
