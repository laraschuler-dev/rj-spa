export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string | null;
  };
}
