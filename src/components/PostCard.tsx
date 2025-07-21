import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { BsThreeDots } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';
import Typography from './ui/Typography';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import PostActions from './ui/PostActions';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatarUrl?: string;
    profileType?: string;
  };
  images: string[];
  createdAt: string;
  categoryId: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAttend?: () => void;
  isLiked?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  author,
  images,
  createdAt,
  categoryId,
  onLike,
  onComment,
  onShare,
  onAttend,
  isLiked,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 space-y-3 max-w-[600px] mx-auto w-full">
      {/* Cabeçalho com avatar, nome e menu */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {author.avatarUrl ? (
            <img
              src={resolveImageUrl(author.avatarUrl)}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border">
              <CgProfile size={20} className="text-gray-500" />
            </div>
          )}
          <div>
            <Typography variant="h3" className="font-medium text-gray-800">
              {author.name}
            </Typography>
            <Typography variant="p" className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </div>
        </div>

        <button className="text-gray-600 hover:text-gray-800">
          <BsThreeDots className="hover:text-gray-500" size={20} />
        </button>
      </div>
      {/* Título */}
      <Typography variant="h2" className="text-lg font-semibold text-gray-900">
        {title}
      </Typography>
      {/* Conteúdo resumido */}
      <Typography variant="p" className="text-sm text-gray-700 line-clamp-3">
        {content}
      </Typography>
      {/* Carrossel de imagens */}
      {images.length > 0 && (
        <Swiper spaceBetween={8} slidesPerView={1} className="rounded-xl">
          {images.map((url, index) => (
            <SwiperSlide key={`${id}-img-${index}`}>
              <img
                src={resolveImageUrl(url)}
                alt={`Imagem ${index + 1}`}
                className="w-full aspect-[4/3] md:aspect-[16/9] object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Ver mais */}
      <div className="text-right">
        <Link
          to={`/posts/${id}`}
          className="text-primary text-sm font-medium hover:text-blue-500 underline"
        >
          Ver mais
        </Link>
      </div>
      {/* Ações (Curtir, comentar, compartilhar, participar) */}
      <PostActions
        isLiked={isLiked}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onAttend={categoryId === 8 ? onAttend : undefined}
        isEvent={categoryId === 8} // Nome mais semântico que showAttend
      />
    </div>
  );
};

export default PostCard;
