import React from 'react';
import Layout from '../components/layout/Layout';
const Feed: React.FC = () => {
  return (
    <Layout variant="feed">
      {/* Aqui entra o conteúdo real do feed de posts */}
      <h1 className="text-2xl font-bold mb-6">Últimos Posts</h1>
      {/* Componente de listagem de posts viria aqui */}
    </Layout>
  );
};

export default Feed;
