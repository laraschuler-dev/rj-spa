// src/components/ui/PostMenuButton.tsx
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BsThreeDots } from 'react-icons/bs';

interface PostMenuButtonProps {
  postId: number;
  shareId?: number; // opcional, usado se for compartilhamento
  onEdit?: (postId: number, shareId?: number) => void;
  onDelete?: (postId: number, shareId?: number) => void;
  className?: string;
}

const PostMenuButton: React.FC<PostMenuButtonProps> = ({
  postId,
  shareId,
  onEdit,
  onDelete,
  className,
}) => {
  return (
    <Menu as="div" className={`relative ${className || ''}`}>
      <Menu.Button className="text-gray-600 hover:text-gray-800">
        <BsThreeDots size={18} />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-1 z-20">
          {onEdit && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onEdit(postId, shareId)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } w-full text-left px-4 py-2 text-sm text-gray-700`}
                >
                  Editar
                </button>
              )}
            </Menu.Item>
          )}
          {onDelete && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onDelete(postId, shareId)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } w-full text-left px-4 py-2 text-sm text-red-600`}
                >
                  Excluir
                </button>
              )}
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default PostMenuButton;
