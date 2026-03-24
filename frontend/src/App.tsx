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
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';
import VnpayReturnPage from './pages/customer/VnpayReturnPage';
import CollectionsPage from './pages/customer/CollectionsPage';
import BrandsPage from './pages/customer/BrandsPage';

// Pages — Admin
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductListPage from './pages/admin/ProductListPage';
import AdminProductFormPage from './pages/admin/ProductFormPage';
import AdminOrderListPage from './pages/admin/OrderListPage';
import AdminUserListPage from './pages/admin/UserListPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import AdminInventoryPage from './pages/admin/InventoryPage';

const queryClient = new QueryClient();

// Guards
const GuestRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Outlet />;
  return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} />;
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
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            
            {/* Auth (Guest only) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>
            
            {/* Protected (Customer) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* VNPay Return (public — redirect from VNPay) */}
            <Route path="/checkout/vnpay-return" element={<VnpayReturnPage />} />
          </Route>

          {/* Admin Layout (Dashboard) */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/products" element={<AdminProductListPage />} />
              <Route path="/admin/products/new" element={<AdminProductFormPage />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductFormPage />} />
              <Route path="/admin/orders" element={<AdminOrderListPage />} />
              <Route path="/admin/users" element={<AdminUserListPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/inventory" element={<AdminInventoryPage />} />
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

