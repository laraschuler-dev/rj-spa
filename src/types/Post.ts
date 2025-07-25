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
    availability?: string;
    [key: string]: any;
  };
  images: string[];
  createdAt: string;
  liked?: boolean;
  user_iduser: {
    id: number;
    name: string;
    avatarUrl?: string;
    profileType?: string;
  };
  sharedBy?: {
    id: number;
    name: string;
    avatarUrl?: string;
    message?: string;
    sharedAt: string;
  };
}
