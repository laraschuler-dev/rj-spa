import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';
import Typography from './ui/Typography';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import PostActions from './ui/PostActions';
import CommentSection from './comments/CommentSection';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import PostMenuButton from './ui/PostMenuButton';
import { useEventAttendance } from '../hooks/useEventAttendance';
import { useAuth } from '../hooks/useAuth';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
    profileType?: string;
  };
  images: string[];
  createdAt: string;
  categoryId: number;
  metadata?: {
    [key: string]: any;
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAttend?: () => void;
  isLiked?: boolean;
  isAttending?: boolean;
  sharedBy?: {
    id: number;
    name: string;
    shareId?: number;
    postId: number;
    avatarUrl?: string;
    message?: string;
    sharedAt: string;
  };
  // eslint-disable-next-line no-unused-vars
  onDelete?: (postId: number, shareId?: number) => void;
  expanded?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  author,
  images,
  createdAt,
  categoryId,
  metadata,
  onLike,
  onShare,
  isLiked,
  sharedBy,
  onDelete,
  expanded = false,
}) => {
  const [showComments, setShowComments] = useState(false);
  const postIdForAttendance = sharedBy?.postId ?? id;
  const postShareIdForAttendance = sharedBy?.shareId;

  const postIdForComments = sharedBy ? sharedBy.postId : id;
  const shareIdForComments = sharedBy?.shareId ?? undefined;

  const { status } = useEventAttendance(
    postIdForAttendance,
    postShareIdForAttendance
  );

  const { user } = useAuth();

  const isOriginalDeleted = metadata?.isDeletedOriginal ?? false;

  const displayedAuthor =
    expanded && sharedBy ? sharedBy.originalAuthor || author : author;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 space-y-3 max-w-[600px] mx-auto w-full">
      {/* Se for compartilhamento */}
      {sharedBy && (
        <div className="relative flex flex-col gap-1 text-sm text-gray-500 mb-3 border-b pb-2">
          <div className="relative flex items-center gap-3">
            {sharedBy.avatarUrl ? (
              <img
                src={resolveImageUrl(sharedBy.avatarUrl)}
                alt={sharedBy.name}
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border">
                <CgProfile size={16} className="text-gray-500" />
              </div>
            )}
            <span className="text-sm">
              Compartilhado por <strong>{sharedBy.name}</strong> •{' '}
              <span className="text-xs text-gray-400">
                {formatTimeAgo(sharedBy.sharedAt)}
              </span>
            </span>

            {sharedBy.id === user?.id && (
              <PostMenuButton
                postId={sharedBy.postId}
                shareId={sharedBy.shareId}
                className="absolute top-0 right-0"
                onEdit={(p, s) => console.log('Editar', p, s)}
                onDelete={onDelete}
              />
            )}
          </div>

          {sharedBy.message && (
            <Typography
              variant="p"
              className="text-gray-700 text-sm pl-10 line-clamp-2"
            >
              {sharedBy.message}
            </Typography>
          )}
        </div>
      )}

      {/* Cabeçalho do post original */}
      <div className="relative flex justify-between items-start">
        <div className="flex items-center gap-2">
          {(expanded && sharedBy ? author : author).avatarUrl ? (
            <img
              src={resolveImageUrl(
                expanded && sharedBy ? author.avatarUrl : author.avatarUrl
              )}
              alt={expanded && sharedBy ? author.name : author.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border">
              <CgProfile size={18} className="text-gray-500" />
            </div>
          )}
          <div>
            <Typography
              variant="h3"
              className="font-medium text-gray-800 text-sm"
            >
              <strong>
                {expanded && sharedBy ? author.name : author.name}
              </strong>
            </Typography>
            <Typography variant="p" className="text-xs text-gray-500">
              {formatTimeAgo(createdAt)}
            </Typography>
          </div>
        </div>

        {!sharedBy && author.id === user?.id && (
          <PostMenuButton
            postId={id}
            className="absolute top-0 right-0"
            onEdit={(p) => console.log('Editar', p)}
            onDelete={onDelete}
          />
        )}
      </div>

      {/* Título e conteúdo */}
      {isOriginalDeleted ? (
        <Typography
          variant="p"
          className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded-md"
        >
          Este post original foi removido pelo autor.
        </Typography>
      ) : (
        <>
          <Typography
            variant="h2"
            className="text-sm font-semibold text-gray-700"
          >
            {title}
          </Typography>
          {expanded ? (
            <div className="text-sm text-gray-700 space-y-1">
              {content && <p>{content}</p>}

              {metadata?.itemType && (
                <p>
                  <strong>Tipo:</strong> {metadata.itemType}
                </p>
              )}
              {metadata?.condition && (
                <p>
                  <strong>Condição:</strong> {metadata.condition}
                </p>
              )}
              {metadata?.location && (
                <p>
                  <strong>Local:</strong> {metadata.location}
                </p>
              )}
              {metadata?.date && (
                <p>
                  <strong>Data:</strong> {metadata.date}
                </p>
              )}
              {metadata?.availability && (
                <p>
                  <strong>Disponibilidade:</strong> {metadata.availability}
                </p>
              )}
              {metadata?.description && (
                <p>
                  <strong>Descrição:</strong> {metadata.description}
                </p>
              )}
              {metadata?.isAnonymous !== undefined && (
                <p>
                  <strong>Anonimato:</strong>{' '}
                  {metadata.isAnonymous ? 'Sim' : 'Não'}
                </p>
              )}
              {metadata?.goal && (
                <p>
                  <strong>Objetivo:</strong> {metadata.goal}
                </p>
              )}
              {metadata?.deadline && (
                <p>
                  <strong>Prazo:</strong> {metadata.deadline}
                </p>
              )}
              {metadata?.organizer && (
                <p>
                  <strong>Organizador:</strong> {metadata.organizer}
                </p>
              )}
              {metadata?.type && (
                <p>
                  <strong>Tipo:</strong> {metadata.type}
                </p>
              )}
              {metadata?.urgency && (
                <p>
                  <strong>Urgência:</strong> {metadata.urgency}
                </p>
              )}
              {metadata?.serviceType && (
                <p>
                  <strong>Tipo de Serviço:</strong> {metadata.serviceType}
                </p>
              )}
              {metadata?.qualifications && (
                <p>
                  <strong>Qualificações:</strong> {metadata.qualifications}
                </p>
              )}
              {metadata?.format && (
                <p>
                  <strong>Formato:</strong> {metadata.format}
                </p>
              )}
              {metadata?.duration && (
                <p>
                  <strong>Duração:</strong> {metadata.duration}
                </p>
              )}
              {metadata?.requirements && (
                <p>
                  <strong>Requisitos:</strong> {metadata.requirements}
                </p>
              )}
            </div>
          ) : (
            <Typography
              variant="p"
              className="text-sm text-gray-700 line-clamp-3"
            >
              {content}
            </Typography>
          )}
        </>
      )}

      {/* Carrossel de imagens */}
      {!isOriginalDeleted && images.length > 0 && (
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
      {!isOriginalDeleted && (
        <div className="text-right">
          <Link
            to={`/posts/${sharedBy?.postId ?? id}${
              sharedBy?.shareId ? `?shareId=${sharedBy.shareId}` : ''
            }`}
            className="text-primary text-sm font-medium hover:text-blue-500 underline"
          >
            Ver mais
          </Link>
        </div>
      )}

      {/* Ações */}
      {!isOriginalDeleted && (
        <PostActions
          post={{
            id,
            categoryId,
            sharedBy: sharedBy ? { id: sharedBy.postId } : undefined,
          }}
          isLiked={isLiked}
          onLike={onLike}
          onComment={() => setShowComments((prev) => !prev)}
          onShare={onShare}
          postIdForAttendance={postIdForAttendance}
          postShareIdForAttendance={postShareIdForAttendance}
        />
      )}

      {/* Comentários */}
      {showComments && !isOriginalDeleted && (
        <div className="pt-4 border-t">
          <CommentSection
            postId={postIdForComments}
            shareId={shareIdForComments}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
