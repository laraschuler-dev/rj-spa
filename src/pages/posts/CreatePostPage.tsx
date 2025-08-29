// src/pages/posts/CreatePostPage.tsx
import { useParams } from 'react-router-dom';
import PostFormFactory from '../../components/posts/PostFormFactory';
import { useCreatePost } from '../../hooks/useCreatePost';

const CreatePostPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { createPost } = useCreatePost();

  if (!categoryId) {
    return <p>Categoria inválida.</p>; // fallback simples, pode melhorar com redirect ou error boundary
  }

  return (
    <PostFormFactory
      categoryId={Number(categoryId)}
      mode="create"
      onSubmit={createPost}
    />
  );
};

export default CreatePostPage;
