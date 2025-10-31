// src/components/posts/PostPreviewCard.tsx
import Typography from '../ui/Typography';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { CgProfile } from 'react-icons/cg';
import AvatarInitials from '../ui/AvatarInitials'; // ✅ importa o mesmo componente usado no PostCard

interface PostPreviewCardProps {
  author: {
    name: string;
    avatarUrl?: string;
    id?: number;
  };
  createdAt: string;
  metadata?: { title?: string };
  content?: string;
  images?: { id: number; url: string }[];
  isAnonymous?: boolean; // ✅ opcional, caso queira compatibilidade com posts anônimos
}

const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  author,
  createdAt,
  metadata,
  content,
  images,
  isAnonymous = false,
}) => {
  // ✅ Função reutilizada do PostCard para renderizar avatar
  const renderAuthorAvatar = () => {
    // considera anônimo se explícito ou id === 0
    const authorIsAnonymous = isAnonymous || author.id === 0;

    if (authorIsAnonymous) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border">
          <CgProfile size={40} className="text-gray-500" />
        </div>
      );
    } else if (author.avatarUrl) {
      return (
        <img
          src={resolveImageUrl(author.avatarUrl)}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover border"
        />
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border border-white">
          <AvatarInitials name={author.name} />
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      {/* Cabeçalho (autor + data) */}
      <div className="flex items-center gap-3 mb-3">
        {renderAuthorAvatar()}
        <div>
          <Typography variant="p" className="text-sm font-semibold">
            {isAnonymous ? 'Anônimo' : author.name}
          </Typography>
          <Typography variant="p" className="text-xs text-gray-500">
            {formatTimeAgo(createdAt)}
          </Typography>
        </div>
      </div>

      {/* Título */}
      {metadata?.title && (
        <Typography variant="p" className="text-base font-semibold mb-2">
          {metadata.title}
        </Typography>
      )}

      {/* Conteúdo */}
      {content && (
        <Typography variant="p" className="text-sm text-gray-700 mb-3">
          {content}
        </Typography>
      )}

      {/* Imagens */}
      {images?.length ? (
        <Swiper spaceBetween={8} slidesPerView={1} className="rounded-xl">
          {images.map((img) => (
            <SwiperSlide key={img.id}>
              <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={resolveImageUrl(img.url)}
                  alt="post image"
                  className="w-full h-full object-contain transition-transform duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </div>
  );
};

export default PostPreviewCard;
