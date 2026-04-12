import React from 'react';
import Header from './Header';
import HeaderFeed from './HeaderFeed';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'feed';
}

const Layout: React.FC<LayoutProps> = ({ children, variant = 'default' }) => {
  const isFeed = variant === 'feed';

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-800">
      {isFeed ? <HeaderFeed /> : <Header />}

      <div className="flex flex-1 min-h-[120vh]">
        {' '}
        <Sidebar />
        <main
          className={`flex-1 pt-20 px-4 md:px-8 pb-8 ${
            variant === 'feed' ? 'max-w-4xl mx-auto' : 'lg:px-12'
          } overflow-auto w-full`}
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
