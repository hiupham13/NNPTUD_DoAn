import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const forgotSchema = z.object({
  email: z.string().email('Cần một địa chỉ email hợp lệ'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      await api.post('/auth/forgot-password', data);
      toast.success('Liên kết khôi phục đã được gửi vào email của bạn');
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
          Khôi phục <span className="italic text-primary-container">*Quyền truy cập*</span>
        </h1>
        <p className="font-body text-sm mb-12 opacity-60 leading-relaxed uppercase tracking-widest">
            Nhập email để nhận liên kết khôi phục mật khẩu.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 block">
          <Input 
            label="Địa chỉ Email"
            type="email"
            placeholder="Nhập email của bạn"
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="pt-8 flex flex-col space-y-6">
            <Button type="submit" variant="outline" isLoading={isSubmitting}>
              Gửi liên kết
            </Button>
            <Link to="/login" className="font-label text-[10px] uppercase tracking-widest text-primary font-bold hover:underline transition-all mt-6 text-center block w-full">
              Quay lại Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
