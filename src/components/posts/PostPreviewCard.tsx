// src/components/posts/PostPreviewCard.tsx
import Typography from '../ui/Typography';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface PostPreviewCardProps {
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  metadata?: { title?: string };
  content?: string;
  images?: { id: number; url: string }[];
}

const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  author,
  createdAt,
  metadata,
  content,
  images,
}) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      {/* Cabeçalho (autor + data) */}
      <div className="flex items-center gap-3 mb-3">
        {author.avatarUrl && (
          <img
            src={resolveImageUrl(author.avatarUrl)}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <Typography variant="p" className="text-sm font-semibold">
            {author.name}
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
              <img
                src={resolveImageUrl(img.url)}
                alt="post image"
                className="w-full aspect-[4/3] md:aspect-[16/9] object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </div>
  );
};

export default PostPreviewCard;
