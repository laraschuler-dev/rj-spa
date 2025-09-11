import { Link } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, className }) => {
  return (
    <Link
      to={to}
      className={`flex items-center transition-colors duration-200 ${className}`}
    >
      <MdArrowBackIos className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#004AAD] hover:text-[#003080]" />
    </Link>
  );
};

export default BackButton;
