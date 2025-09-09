// src/components/posts/PostPreviewCard.tsx
import Typography from '../ui/Typography';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

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
        <div
          className={`grid gap-2 ${
            images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={resolveImageUrl(img.url)}
              alt="post image"
              className="w-full max-h-60 rounded-xl object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PostPreviewCard;
