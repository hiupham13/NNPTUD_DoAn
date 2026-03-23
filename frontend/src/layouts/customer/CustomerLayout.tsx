import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative overflow-x-hidden">
      {/* Paper texture overlay */}
      <div className="paper-texture"></div>

      {/* Visible Grid Lines for Desktop */}
      <div className="fixed inset-0 pointer-events-none z-10 container mx-auto max-w-[1600px] px-12 grid grid-cols-12 h-full hidden md:grid">
        <div className="border-l border-outline-variant opacity-20 col-start-1"></div>
        <div className="border-l border-outline-variant opacity-20 col-start-4"></div>
        <div className="border-l border-outline-variant opacity-20 col-start-9"></div>
        <div className="border-l border-outline-variant opacity-20 col-start-12 border-r"></div>
      </div>

      <CustomerHeader />
      
      <main className="relative z-20 min-h-[calc(100vh-400px)]">
        <Outlet />
      </main>

      <CustomerFooter />
    </div>
  );
}
