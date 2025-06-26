import React from 'react';
import HeaderFeed from './HeaderFeed';
import Sidebar from './Sidebar';

interface FeedLayoutProps {
  children: React.ReactNode;
}

const FeedLayout: React.FC<FeedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-gray-800">
      <HeaderFeed />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 px-4 md:px-8 lg:px-12 pb-8">{children}</main>
      </div>
    </div>
  );
};

export default FeedLayout;
