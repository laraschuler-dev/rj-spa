import { useParams } from "react-router-dom";
import PostFormFactory from "@/components/posts/PostFormFactory";
import { useUpdatePost } from "@/hooks/posts/useUpdatePost";
import { useFetchPost } from "@/hooks/posts/useFetchPost";

const EditPostPage = () => {
  const { id } = useParams();
  const { updatePost } = useUpdatePost();
  const { data: post } = useFetchPost(Number(id));

  if (!post) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto py-8">
      <PostFormFactory
        categoryId={post.categoria_idcategoria}
        mode="edit"
        initialData={post}
        onSubmit={(data) => updatePost(post.idpost, data)}
      />
    </div>
  );
};

export default EditPostPage;
