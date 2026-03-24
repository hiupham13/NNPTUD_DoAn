import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Tên ít nhất 2 ký tự'),
  email: z.string().email('Cần một địa chỉ email hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });
  
  const loginAction = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await api.post('/auth/register', data);
      const { user, token } = res.data.data;
      loginAction(user, token);
      toast.success('Đăng ký tài khoản thành công');
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] grid grid-cols-1 md:grid-cols-12 w-full pt-20 md:pt-10">
      <section className="animate-slide-in-right md:col-span-5 px-8 md:px-12 lg:px-24 py-16 flex flex-col justify-center relative z-20 order-2 md:order-1">
        <div className="max-w-md ml-auto md:mr-12 w-full">
          <header className="mb-16">
            <h1 className="font-display text-5xl md:text-6xl text-on-surface leading-tight">
              Tạo <span className="italic text-primary-container font-light">Tài Khoản</span>
            </h1>
            <p className="mt-4 text-on-surface-variant/70 font-light tracking-wide font-body text-sm leading-relaxed">
              Nhập thông tin của bạn để trở thành hội viên và thưởng lãm các bộ sưu tập giới hạn.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <Input 
              label="Họ và Tên" 
              type="text" 
              placeholder="NHẬP HỌ VÀ TÊN" 
              {...register('name')} 
              error={errors.name?.message} 
            />

            <Input 
              label="Địa Chỉ Email" 
              type="email" 
              placeholder="CONTACT@DOMAIN.COM" 
              {...register('email')} 
              error={errors.email?.message} 
            />

            <Input 
              label="Mật Khẩu" 
              type="password" 
              placeholder="••••••••" 
              {...register('password')} 
              error={errors.password?.message} 
            />

            <div className="pt-8 w-full">
              <Button type="submit" variant="outline" isLoading={isSubmitting}>
                GIA NHẬP HỘI VIÊN
              </Button>
            </div>
          </form>

          <footer className="mt-12 flex items-center gap-2">
            <span className="font-label text-[11px] tracking-widest uppercase text-on-surface-variant/60">Đã có tài khoản?</span>
            <Link to="/login" className="font-label text-[11px] tracking-widest uppercase text-on-surface-variant hover:text-primary-container transition-colors duration-500 border-b border-outline-variant pb-1">Đăng Nhập</Link>
          </footer>
        </div>
      </section>

      <section className="animate-slide-in-left md:col-span-7 relative overflow-hidden h-[400px] md:h-auto group order-1 md:order-2 flex items-center">
        <div 
          className="absolute inset-0 grayscale contrast-125 hover:grayscale-0 transition-all duration-[1500ms] ease-in-out bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute right-12 bottom-12 z-30 hidden md:block">
          <span className="vertical-rl font-label uppercase tracking-[0.5em] text-[10px] text-white/80 font-light mix-blend-difference">
            Heritage / Since 2026
          </span>
        </div>
        <div className="absolute inset-0 bg-surface/10 pointer-events-none group-hover:bg-transparent transition-colors duration-1000"></div>
      </section>
    </div>
  );
}
