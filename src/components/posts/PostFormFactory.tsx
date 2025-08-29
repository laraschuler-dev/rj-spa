// src/components/posts/PostFormFactory.tsx
import CampaignPostForm from './forms/CampaignPostForm';
import ComplaintPostForm from './forms/ComplaintPostForm';
import CoursePostForm from './forms/CoursePostForm';
import DonationPostForm from './forms/DonationPostForm';
import EventPostForm from './forms/EventPostForm';
import GeneralPostForm from './forms/GeneralPostForm';
import HelpRequestPostForm from './forms/HelpRequestPostForm';
import JobPostForm from './forms/JobPostForm';
import VolunteerPostForm from './forms/VolunteerPostForm';

interface PostFormFactoryProps {
  categoryId: number;
  mode: 'create' | 'edit';
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: any;
}

const formMap: Record<number, React.FC<PostFormFactoryProps>> = {
  1: DonationPostForm,
  2: ComplaintPostForm,
  3: CampaignPostForm,
  4: HelpRequestPostForm,
  5: VolunteerPostForm,
  6: CoursePostForm,
  7: JobPostForm,
  8: EventPostForm,
  9: GeneralPostForm,
};

const PostFormFactory: React.FC<PostFormFactoryProps> = ({
  categoryId,
  mode,
  onSubmit,
  initialData,
}) => {
  const FormComponent = formMap[categoryId];

  if (!FormComponent) {
    return <div>Categoria não suportada</div>;
  }

  return (
    <FormComponent
      categoryId={categoryId}
      mode={mode}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
};

export default PostFormFactory;
