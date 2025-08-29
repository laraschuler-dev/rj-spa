import { Key } from 'react';

export interface PostListItem {
  uniqueKey: Key | null | undefined; //Identificador único universal para renderização de listas
  id: number;
  content: string;
  categoria_idcategoria: number;
  metadata: {
    title?: string;
    itemType?: string;
    condition?: string;
    location?: string;
    date?: string;
    availability?: string;
    description?: string;
    isAnonymous?: boolean;
    goal?: string;
    deadline?: string;
    organizer?: string;
    type?: string;
    urgency?: string;
    serviceType?: string;
    qualifications?: string;
    format?: string;
    duration?: string;
    requirements?: string;
    [key: string]: any;
  };
  images: string[];
  createdAt: string;
  liked?: boolean;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
    profileType?: string;
  };
  sharedBy?: {
    shareId: number;
    postId: number;
    id: number;
    name: string;
    avatarUrl?: string;
    message?: string;
    sharedAt: string;
  };
}
