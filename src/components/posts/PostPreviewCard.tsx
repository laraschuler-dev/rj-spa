// src/components/posts/PostPreviewCard.tsx
import Typography from '../ui/Typography';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { CgProfile } from 'react-icons/cg';
import AvatarInitials from '../ui/AvatarInitials';

interface PostPreviewCardProps {
  author: {
    name: string;
    avatarUrl?: string;
    id?: number;
  };
  createdAt: string;
  metadata?: {
    title?: string;
    isUnavailable?: boolean;
    originalAuthorDeleted?: boolean;
  };
  content?: string;
  images?: { id: number; url: string }[];
  isAnonymous?: boolean;
}

const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  author,
  createdAt,
  metadata,
  content,
  images,
  isAnonymous = false,
}) => {
  // ✅ Função melhorada para renderizar avatar
  const renderAuthorAvatar = () => {
    const isAuthorRemoved =
      author.id === 0 && author.name === 'Usuário Removido';

    const isUnavailableAuthorRemoved =
      metadata?.isUnavailable && metadata?.originalAuthorDeleted;

    const shouldShowAnonymousAvatar =
      isAnonymous || isAuthorRemoved || isUnavailableAuthorRemoved;

    if (shouldShowAnonymousAvatar) {
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

  // ✅ Função para determinar o nome do autor
  const getAuthorName = () => {
    if (isAnonymous) return 'Anônimo';
    if (author.id === 0 && author.name === 'Usuário Removido')
      return 'Usuário Removido';
    if (metadata?.isUnavailable && metadata?.originalAuthorDeleted)
      return 'Usuário Removido';
    return author.name;
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      {/* Cabeçalho (autor + data) */}
      <div className="flex items-center gap-3 mb-3">
        {renderAuthorAvatar()}
        <div>
          <Typography variant="p" className="text-sm font-semibold">
            {getAuthorName()}
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

      {/* Conteúdo - MOSTRA APENAS SE NÃO FOR INDISPONÍVEL */}
      {content && !metadata?.isUnavailable && (
        <Typography variant="p" className="text-sm text-gray-700 mb-3">
          {content}
        </Typography>
      )}

      {/* Mensagem de conteúdo indisponível */}
      {metadata?.isUnavailable && (
        <Typography
          variant="p"
          className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded-md mb-3"
        >
          Conteúdo indisponível
          {metadata.originalAuthorDeleted &&
            ' - O autor do post original não está mais na plataforma'}
          {metadata.originalPostDeleted &&
            !metadata.originalAuthorDeleted &&
            ' - O post original foi removido pelo autor'}
        </Typography>
      )}

      {/* Imagens - MOSTRA APENAS SE NÃO FOR INDISPONÍVEL */}
      {images?.length && !metadata?.isUnavailable ? (
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
