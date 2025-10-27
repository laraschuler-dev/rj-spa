import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Typography from './ui/Typography';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import PostActions from './ui/PostActions';
import CommentSection from './comments/CommentSection';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import formatDateBR from '../utils/formatDateBR';
import PostMenuButton from './ui/PostMenuButton';
import { useEventAttendance } from '../hooks/useEventAttendance';
import AvatarInitials from './ui/AvatarInitials';

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
  onLike?: (postId: number, shareId?: number) => void;
  onComment?: () => void;
  onShare?: () => void;
  onAttend?: () => void;
  isAttending?: boolean;
  isLiked?: boolean;
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
  isInModal?: boolean;
  onOpenDetails?: (postId: number, shareId?: number) => void;
  onEdit?: (postId: number, shareId?: number) => void;
  isPostOwner?: boolean;
  isShareOwner?: boolean;
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
  isInModal = false,
  onOpenDetails,
  onEdit,
  isPostOwner = false,
  isShareOwner = false,
}) => {
  const [showComments, setShowComments] = useState(false);
  const postIdForAttendance = sharedBy?.postId ?? id;
  const postShareIdForAttendance = sharedBy?.shareId;

  const postIdForComments = sharedBy ? sharedBy.postId : id;
  const shareIdForComments = sharedBy?.shareId ?? undefined;

  const { status, toggleAttendance, loading } = useEventAttendance(
    postIdForAttendance,
    postShareIdForAttendance
  );

  const isOriginalDeleted = metadata?.isDeletedOriginal ?? false;

  // ✅ Verifica se é post anônimo
  const isAnonymousPost = categoryId === 2 && metadata?.isAnonymous;

  // Garante que sempre seja Date válido
  const safeCreatedAt = createdAt ? new Date(createdAt) : new Date();
  const safeSharedAt = sharedBy?.sharedAt
    ? new Date(sharedBy.sharedAt)
    : new Date();

  // ✅ Função para renderizar avatar do autor
  const renderAuthorAvatar = () => {
    const currentAuthor = expanded && sharedBy ? author : author;

    if (isAnonymousPost) {
      // ✅ Cenário 3: Post anônimo - mostra ícone
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border">
          <CgProfile size={18} className="text-gray-500" />
        </div>
      );
    } else if (currentAuthor.avatarUrl) {
      // ✅ Cenário 1: Com avatar - mostra imagem
      return (
        <img
          src={resolveImageUrl(currentAuthor.avatarUrl)}
          alt={currentAuthor.name}
          className="w-10 h-10 rounded-full object-cover border"
        />
      );
    } else {
      // ✅ Cenário 2: Sem avatar - mostra iniciais
      return (
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border border-white">
          <AvatarInitials name={currentAuthor.name} />
        </div>
      );
    }
  };

  // ✅ Função para renderizar avatar do compartilhador
  const renderSharedByAvatar = () => {
    if (!sharedBy) return null;

    if (sharedBy.avatarUrl) {
      return (
        <img
          src={resolveImageUrl(sharedBy.avatarUrl)}
          alt={sharedBy.name}
          className="w-8 h-8 aspect-square rounded-full object-cover border"
        />
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-white">
          <AvatarInitials name={sharedBy.name} />
        </div>
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 space-y-3 max-w-[600px] mx-auto w-full">
      {/* Se for compartilhamento */}
      {sharedBy && (
        <div className="relative flex flex-col gap-1 text-sm text-gray-500 mb-3 border-b pb-2">
          <div className="relative flex items-center gap-3">
            {renderSharedByAvatar()}
            <span className="text-sm">
              Compartilhado por <strong>{sharedBy.name}</strong> •{' '}
              <span className="text-xs text-gray-400">
                {formatTimeAgo(safeSharedAt.toISOString())}
              </span>
            </span>

            {isShareOwner && !isInModal && (
              <PostMenuButton
                postId={sharedBy.postId}
                shareId={sharedBy.shareId}
                className="ml-auto"
                onEdit={onEdit}
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
          {renderAuthorAvatar()}
          <div>
            <Typography
              variant="h3"
              className="font-medium text-gray-800 text-sm"
            >
              <strong>
                {isAnonymousPost
                  ? 'Anônimo'
                  : expanded && sharedBy
                    ? author.name
                    : author.name}
              </strong>
            </Typography>
            <Typography variant="p" className="text-xs text-gray-500">
              {formatTimeAgo(safeCreatedAt.toISOString())}
            </Typography>
          </div>
        </div>

        {!sharedBy && isPostOwner && !isInModal && (
          <PostMenuButton
            postId={id}
            className="absolute top-0 right-0"
            onEdit={onEdit}
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
              {categoryId === 2 ? (
                <>
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
                </>
              ) : (
                <>
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
                      <strong>Data:</strong> {formatDateBR(metadata.date)}
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
                      <strong>Prazo:</strong> {formatDateBR(metadata.deadline)}
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
                </>
              )}
            </div>
          ) : (
            <Typography
              variant="p"
              className="text-sm text-gray-700 line-clamp-3"
            >
              {categoryId === 2 ? metadata?.description : content}
            </Typography>
          )}
        </>
      )}
      <Swiper spaceBetween={8} slidesPerView={1} className="rounded-xl">
        {images.map((url, index) => (
          <SwiperSlide key={`${id}-img-${index}`}>
            <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={resolveImageUrl(url)}
                alt={`Imagem ${index + 1}`}
                className="object-contain w-full h-full transition-transform duration-300"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Ver mais */}
      {!isOriginalDeleted && (
        <div className="text-right">
          {!expanded && !isInModal && (
            <button
              className="text-blue-500 text-sm font-medium hover:underline focus:outline-none"
              onClick={() => onOpenDetails?.(id, sharedBy?.shareId)}
            >
              Ver mais
            </button>
          )}
        </div>
      )}

      {/* Ações */}
      {!isOriginalDeleted && (
        <PostActions
          post={{
            id,
            categoryId,
            sharedBy: sharedBy?.shareId
              ? { shareId: sharedBy.shareId }
              : undefined,
          }}
          isLiked={isLiked ?? false}
          onLike={onLike}
          onComment={() => setShowComments((prev) => !prev)}
          onShare={onShare}
          onAttend={toggleAttendance} // ✅ usa hook
          isAttending={status.attending} // ✅ vem do hook
          loadingAttend={loading} // opcional: se quiser desabilitar botão enquanto envia
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
