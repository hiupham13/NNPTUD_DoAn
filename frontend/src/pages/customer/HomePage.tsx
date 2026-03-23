import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="container mx-auto max-w-[1600px] px-12 pt-48 pb-32">
            <section className="grid grid-cols-12 gap-8 min-h-[819px] items-center mb-32">
                <div className="col-span-12 md:col-start-2 md:col-span-7">
                    <span className="font-label uppercase tracking-[0.4em] text-xs mb-8 block opacity-60">Tuyệt tác Thời gian</span>
                    <h1 className="font-display text-7xl md:text-9xl leading-[1.1] tracking-tighter mb-12">
                        Đồng Hồ <span className="italic font-light text-primary-container">*Cao Cấp*</span><br />
                        Định Danh <span className="italic font-light">*Chính Xác*</span>
                    </h1>
                    <p className="font-body text-lg md:text-xl max-w-lg mb-12 leading-relaxed opacity-80">
                        Sự tuyển chọn khắt khe những thương hiệu đồng hồ danh giá bậc nhất trên thế giới. Giao thoa giữa vẻ đẹp cổ điển và công nghệ tinh xảo.
                    </p>
                    <Link to="/products">
                        <button className="cta-button border border-on-surface px-12 py-5 uppercase tracking-widest text-xs font-label z-10 w-auto">
                            Khám Phá Tổ Hợp
                        </button>
                    </Link>
                </div>
                <div className="col-span-12 md:col-start-9 md:col-span-4 flex justify-end">
                    <div className="relative w-full aspect-[3/4] overflow-hidden group">
                        <img
                            alt="Luxury watch detail"
                            className="w-full h-full object-cover grayscale-hover"
                            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop"
                        />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-12 gap-8 mb-64 relative">
                <div className="absolute -left-12 top-0 h-full flex items-start pt-4">
                    <span className="vertical-rl font-label text-[10px] tracking-[0.5em] uppercase opacity-40">Di sản / 2026</span>
                </div>
                <div className="col-span-12 md:col-start-2 md:col-span-5">
                    <p className="drop-cap font-body text-xl leading-relaxed text-on-surface/90">
                        Bản chất của kỹ thuật chế tác không chỉ dừng ở việc đong đếm thời gian, mà là làm chủ nó. Từng bánh răng, từng tinh thể đều toát lên một luồng sinh khí riêng. Hãy tản mạn cùng những kiệt tác cơ học này bằng một tâm hồn thưởng lãm nghệ thuật.
                    </p>
                </div>
                <div className="col-span-12 md:col-start-8 md:col-span-4 pt-12">
                    <div className="border-t border-outline-variant/30 pt-8">
                        <h3 className="font-display text-2xl italic mb-4">Chế Tác Thụy Sĩ</h3>
                        <p className="font-body text-sm leading-relaxed opacity-70">
                            Sự cân bằng hoàn hảo giữa tính toàn vẹn trong cấu trúc hình học và một bề mặt láng bóng thẩm mỹ, được kiến tạo ra để trường tồn vĩnh viễn.
                        </p>
                    </div>
                </div>
            </section>

            {/* Note: I will add the grid of collections/products in D10, but here's a placeholder for layout */}
            <section className="mb-16">
                <div className="flex justify-between items-end mb-12 border-b border-outline-variant/10 pb-8">
                    <h2 className="font-display text-5xl italic">Thương Hiệu *Nổi Bật*</h2>
                    <Link to="/brands" className="font-label text-xs uppercase tracking-[0.2em] opacity-50 hover:text-primary-container transition-colors">Xem tất cả</Link>
                </div>
                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-12 md:col-span-4 border-t border-on-surface pt-8 group cursor-pointer">
                        <div className="overflow-hidden aspect-[4/3] mb-6">
                            <img alt="Rolex" className="w-full h-full object-cover grayscale-hover" src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop" />
                        </div>
                        <h3 className="font-display text-3xl mb-2 italic">Rolex</h3>
                        <p className="font-body text-sm opacity-60 uppercase tracking-widest">Oyster Perpetual</p>
                    </div>
                    <div className="col-span-12 md:col-span-4 border-t border-on-surface pt-8 group cursor-pointer md:mt-12">
                        <div className="overflow-hidden aspect-[4/3] mb-6">
                            <img alt="Patek Philippe" className="w-full h-full object-cover grayscale-hover" src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop" />
                        </div>
                        <h3 className="font-display text-3xl mb-2 italic">Patek Philippe</h3>
                        <p className="font-body text-sm opacity-60 uppercase tracking-widest">Grand Complications</p>
                    </div>
                    <div className="col-span-12 md:col-span-4 border-t border-on-surface pt-8 group cursor-pointer md:mt-0">
                        <div className="overflow-hidden aspect-[4/3] mb-6">
                            <img alt="Omega" className="w-full h-full object-cover grayscale-hover" src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop" />
                        </div>
                        <h3 className="font-display text-3xl mb-2 italic">Omega</h3>
                        <p className="font-body text-sm opacity-60 uppercase tracking-widest">Seamaster</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
