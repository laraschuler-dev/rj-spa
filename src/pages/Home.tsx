// Home.tsx - VERSÃO COM DEBUG
import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Introduction from '../components/home/Introduction';
import AboutUs from '../components/home/AboutUs';
import Events from '../components/home/Events';
import Services from '../components/home/Services';
import HowToDonate from '../components/home/HowToDonate';
import Contact from '../components/home/Contact';
import Information from '../components/home/Information';
import { useScrollStore } from '../stores/scrollStore';

const Home: React.FC = () => {
  const { targetSection, targetScrollY, setScrollTarget } = useScrollStore();

  // Home.tsx - SCROLL INSTANTÂNEO
  useEffect(() => {
    console.log(
      '🏠 Home - targetSection:',
      targetSection,
      'targetScrollY:',
      targetScrollY
    );

    if (!targetSection && targetScrollY == null) {
      console.log('🏠 Home - Nada para scrollar');
      return;
    }

    const timer = setTimeout(() => {
      console.log('🏠 Home - Executando scroll...');

      if (targetSection) {
        const element = document.getElementById(targetSection);
        console.log('🏠 Home - Elemento encontrado:', element);
        if (element) {
          // ✅ MUDANÇA: Scroll instantâneo ao invés de suave
          element.scrollIntoView({
            behavior: 'auto', // ← Mude para 'auto' (instantâneo)
            block: 'start',
          });
          console.log('✅ Scroll para seção realizado:', targetSection);
        }
      }

      if (targetScrollY !== null) {
        // ✅ MUDANÇA: Scroll instantâneo
        window.scrollTo({ top: targetScrollY, behavior: 'auto' });
        console.log('✅ Scroll para posição realizado:', targetScrollY);
      }

      setScrollTarget(null, null);
    }, 50); // Reduzi para 50ms

    return () => clearTimeout(timer);
  }, [targetSection, targetScrollY, setScrollTarget]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Introduction />
        <AboutUs />
        <Information />
        <Events />
        <Services />
        <HowToDonate />
        <Contact />
      </div>
    </Layout>
  );
};

export default Home;
