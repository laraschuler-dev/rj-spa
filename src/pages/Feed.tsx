import React from 'react';
import FeedLayout from '../components/layout/FeedLayout';
const Feed: React.FC = () => {
  return (
    <FeedLayout>
      {/* Aqui entra o conteúdo real do feed de posts */}
      <h1 className="text-2xl font-bold mb-6">Últimos Posts</h1>
      {/* Componente de listagem de posts viria aqui */}
    </FeedLayout>
  );
};

export default Feed;
