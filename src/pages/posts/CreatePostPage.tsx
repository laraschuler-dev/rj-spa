// src/pages/posts/CreatePostPage.tsx
import { useParams } from 'react-router-dom';
import PostFormFactory from '../../components/posts/PostFormFactory';
import { useCreatePost } from '../../hooks/useCreatePost';

const CreatePostPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { createPost } = useCreatePost();

  if (!categoryId) return <p>Categoria inválida.</p>;

  return (
    <PostFormFactory
      categoryId={Number(categoryId)}
      mode="create"
      onSubmit={async (formData) => {
        const created = await createPost(formData);
        return created;
      }}
    />
  );
};

export default CreatePostPage;
