import { ReactNode } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import Sidebar from './sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content - sempre usa toda a largura, sidebar se sobrepõe */}
      <main className="min-h-screen w-full">
        <div className="p-6 pt-20 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}