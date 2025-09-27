import { Key } from 'react';

export interface EventAttendance {
  userId: number;
  status: string; // 'confirmed' | 'interested' (se futuramente quiser abrir mais)
}

export interface PostListItem {
  likeCount: number | undefined;
  author: any;
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
  attending?: boolean; // 👈 boolean simples pro usuário atual
  eventAttendance?: EventAttendance[]; // 👈 lista de presenças (caso queira mostrar todos os participantes)
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
  isPostOwner?: boolean;
  isShareOwner?: boolean;
}
