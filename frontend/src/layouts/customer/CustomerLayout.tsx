import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative overflow-x-hidden">
      {/* Paper texture overlay */}
      <div className="paper-texture"></div>


      <CustomerHeader />
      
      <main className="relative z-20 min-h-[calc(100vh-400px)]">
        <Outlet />
      </main>

      <CustomerFooter />
    </div>
  );
}
