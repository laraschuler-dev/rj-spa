export interface PostComment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string | null;
  };
}
