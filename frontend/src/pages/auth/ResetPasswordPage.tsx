import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const resetSchema = z.object({
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema)
  });
  
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await api.post(`/auth/reset-password/${token}`, data);
      toast.success('Mật khẩu đã được thiết lập lại thành công');
      navigate('/login');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-24 bg-surface">
      <div className="max-w-md w-full px-8">
        <header className="mb-16">
          <h2 className="font-display italic text-2xl tracking-tight text-on-surface mb-2">Luxury Watch Store</h2>
          <div className="w-12 h-px bg-primary-container"></div>
        </header>

        <h1 className="font-display text-5xl mb-6 tracking-tighter">
          Mật Khẩu <span className="italic text-primary-container">*Mới*</span>
        </h1>
        <p className="font-body text-sm mb-12 opacity-60 leading-relaxed uppercase tracking-widest">
            Thiết lập mật khẩu bảo mật mới cho tài khoản của bạn.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 block">
          <Input 
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="pt-8 flex flex-col space-y-6">
            <Button type="submit" variant="outline" isLoading={isSubmitting}>
              Xác nhận mật khẩu
            </Button>
            <Link to="/login" className="font-label text-[10px] uppercase tracking-widest text-primary font-bold hover:underline transition-all mt-6 text-center block w-full">
              Huỷ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
