import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Cần một địa chỉ email hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });
  
  const loginAction = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await api.post('/auth/login', data);
      const { user, token } = res.data.data;
      loginAction(user, token);
      toast.success('Xác thực thành công');
      // Admin → Dashboard, Customer → Trang chủ
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Xác thực thất bại');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface">
      <section className="animate-slide-in-right relative w-full md:w-7/12 h-[300px] md:h-screen bg-surface-container-low flex items-center justify-center p-12 lg:p-24 overflow-hidden">
        <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:block">
          <span className="vertical-rl font-label text-[10px] tracking-[0.4em] uppercase text-on-surface-variant opacity-60">
            Đặc Quyền Hội Viên © 2026
          </span>
        </div>
        <div className="relative w-full h-full max-w-xl whisper-shadow border border-outline-variant/10 group overflow-hidden">
          <img 
            alt="Luxury Watch Close Up" 
            className="w-full h-full object-cover grayscale-hover" 
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop" 
          />
          <div className="absolute bottom-8 right-[-2rem] hidden lg:block bg-surface p-6 border border-outline-variant/20 whisper-shadow transition-transform duration-1000 group-hover:translate-x-[-2rem]">
            <p className="font-display italic text-xl text-primary-container">"Vẻ đẹp vượt thời gian."</p>
          </div>
        </div>
      </section>

      <section className="animate-slide-in-left w-full md:w-5/12 flex flex-col justify-center px-8 lg:px-20 py-16 bg-surface z-20">
        <header className="mb-16">
          <h2 className="font-display italic text-2xl tracking-tight text-on-surface mb-2">Luxury Watch Store</h2>
          <div className="w-12 h-px bg-primary-container"></div>
        </header>

        <div className="max-w-md w-full">
          <h1 className="font-display text-5xl lg:text-7xl mb-12 tracking-tighter leading-tight">
            Đăng nhập <br/><span className="italic text-primary-container">*Tài khoản*</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 block">
            <Input 
              label="Địa Chỉ Email" 
              type="email" 
              placeholder="Nhập email của bạn" 
              {...register('email')} 
              error={errors.email?.message} 
            />

            <Input 
              label="Mật khẩu" 
              type="password" 
              placeholder="Nhập mật khẩu" 
              {...register('password')} 
              error={errors.password?.message} 
            />

            <div className="pt-8 flex flex-col space-y-6">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Đăng nhập
              </Button>
              
              <div className="flex items-center justify-between mt-6">
                <Link to="/forgot-password" className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                  Quên mật khẩu?
                </Link>
                <div className="h-px w-8 bg-outline-variant/30"></div>
                <Link to="/register" className="font-label text-[10px] uppercase tracking-widest text-primary font-bold hover:underline underline-offset-4 decoration-primary-container transition-all">
                  Đăng ký tài khoản
                </Link>
              </div>
            </div>
          </form>
        </div>

        <footer className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-end">
          <div className="space-y-1">
            <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/40">Kết nối bảo mật</p>
          </div>
          <div className="flex space-x-4">
            <ShieldCheck className="text-outline-variant/40 w-4 h-4" />
          </div>
        </footer>
      </section>
    </div>
  );
}
