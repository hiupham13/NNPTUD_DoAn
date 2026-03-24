import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Layouts
import CustomerLayout from './layouts/customer/CustomerLayout';
import AdminLayout from './layouts/admin/AdminLayout';

// Pages — Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Pages — Customer
import HomePage from './pages/customer/HomePage';
import ProductListPage from './pages/customer/ProductListPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';

// Pages — Admin
import DashboardPage from './pages/admin/DashboardPage';

const queryClient = new QueryClient();

// Guards
const GuestRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <Outlet />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Customer Layout (Luxury Editorial) */}
          <Route element={<CustomerLayout />}>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            
            {/* Auth (Guest only) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>
            
            {/* Protected (Customer) */}
            <Route element={<ProtectedRoute />}>
              {/* D11: Cart, Checkout, Orders, Profile */}
            </Route>
          </Route>

          {/* Admin Layout (Dashboard) */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              {/* D12: ProductManage, OrderManage, UserManage */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            borderRadius: '0',
            border: '1px solid #e0e0e0',
            background: '#faf9f6',
            color: '#2c2c2c',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;

