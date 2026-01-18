// Server Component - Layout principal del grupo (main)

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainLayoutWrapper from '@/components/MainLayoutWrapper';

export default function MainLayout({ children }) {
  return (
    <MainLayoutWrapper>
      <Header />
      <main className="flex-1 flex justify-center">
        {children}
      </main>
      <Footer />
    </MainLayoutWrapper>
  );
}
