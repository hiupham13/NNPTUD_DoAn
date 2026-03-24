import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAdminProductById, useCreateProduct, useUpdateProduct } from '../../hooks/useProductAdmin';
import ImageUploader from '../../components/admin/ImageUploader';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './ProductFormPage.css';

const MOVEMENTS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'quartz', label: 'Quartz' },
  { value: 'eco-drive', label: 'Eco-Drive' },
  { value: 'solar', label: 'Solar' },
];

const GENDERS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'unisex', label: 'Unisex' },
];

interface FormData {
  name: string;
  sku: string;
  description: string;
  originalPrice: string;
  discountPercent: string;
  category: string;
  collectionRef: string;
  movement: string;
  gender: string;
  caseMaterial: string;
  caseSize: string;
  strapMaterial: string;
  waterResistance: string;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
}

const defaultForm: FormData = {
  name: '', sku: '', description: '',
  originalPrice: '', discountPercent: '0',
  category: '', collectionRef: '',
  movement: 'automatic', gender: 'male',
  caseMaterial: '', caseSize: '', strapMaterial: '', waterResistance: '',
  isFeatured: false, isActive: true, images: [],
};

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: product, isLoading: productLoading } = useAdminProductById(id || '');
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [form, setForm] = useState<FormData>(defaultForm);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Load categories + collections
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data || []));
    api.get('/collections').then(res => setCollections(res.data.data || []));
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        originalPrice: String(product.originalPrice || product.price || ''),
        discountPercent: String(product.discountPercent || 0),
        category: product.category?._id || product.category || '',
        collectionRef: product.collectionRef?._id || product.collectionRef || '',
        movement: product.movement || 'automatic',
        gender: product.gender || 'male',
        caseMaterial: product.caseMaterial || '',
        caseSize: product.caseSize || '',
        strapMaterial: product.strapMaterial || '',
        waterResistance: product.waterResistance || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== false,
        images: product.images || [],
      });
    }
  }, [isEdit, product]);

  const handleChange = (key: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Vui lòng nhập tên sản phẩm');
    if (!form.sku.trim()) return toast.error('Vui lòng nhập mã SKU');
    if (!form.originalPrice || Number(form.originalPrice) <= 0) return toast.error('Vui lòng nhập giá hợp lệ');
    if (!form.category) return toast.error('Vui lòng chọn thương hiệu');

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description,
      price: Number(form.originalPrice),
      originalPrice: Number(form.originalPrice),
      discountPercent: Number(form.discountPercent) || 0,
      category: form.category,
      collectionRef: form.collectionRef || undefined,
      movement: form.movement,
      gender: form.gender,
      caseMaterial: form.caseMaterial,
      caseSize: form.caseSize,
      strapMaterial: form.strapMaterial,
      waterResistance: form.waterResistance,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      images: form.images,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, payload });
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Tạo sản phẩm thành công');
      }
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && productLoading) {
    return <div className="pf-loading">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="product-form">
      <div className="pf-header">
        <button className="pf-back" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="pf-title">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="pf-grid">
        {/* Left Column */}
        <div className="pf-col">
          <section className="pf-section">
            <h2 className="pf-section__title">Thông tin cơ bản</h2>
            <div className="pf-field">
              <label>Tên sản phẩm *</label>
              <input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="VD: Rolex Submariner" />
            </div>
            <div className="pf-row">
              <div className="pf-field">
                <label>Mã SKU *</label>
                <input value={form.sku} onChange={e => handleChange('sku', e.target.value)} placeholder="VD: ROL-SUB-001" />
              </div>
              <div className="pf-field">
                <label>Thương hiệu *</label>
                <select value={form.category} onChange={e => handleChange('category', e.target.value)}>
                  <option value="">-- Chọn --</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="pf-field">
              <label>Bộ sưu tập</label>
              <select value={form.collectionRef} onChange={e => handleChange('collectionRef', e.target.value)}>
                <option value="">-- Không --</option>
                {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="pf-field">
              <label>Mô tả</label>
              <textarea rows={4} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
            </div>
          </section>

          <section className="pf-section">
            <h2 className="pf-section__title">Giá</h2>
            <div className="pf-row">
              <div className="pf-field">
                <label>Giá gốc (VND) *</label>
                <input type="number" value={form.originalPrice} onChange={e => handleChange('originalPrice', e.target.value)} placeholder="0" />
              </div>
              <div className="pf-field">
                <label>Giảm giá (%)</label>
                <input type="number" min="0" max="100" value={form.discountPercent} onChange={e => handleChange('discountPercent', e.target.value)} />
              </div>
            </div>
          </section>

          <section className="pf-section">
            <h2 className="pf-section__title">Thông số kỹ thuật</h2>
            <div className="pf-row">
              <div className="pf-field">
                <label>Bộ máy</label>
                <select value={form.movement} onChange={e => handleChange('movement', e.target.value)}>
                  {MOVEMENTS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="pf-field">
                <label>Giới tính</label>
                <select value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                  {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
            </div>
            <div className="pf-row">
              <div className="pf-field">
                <label>Chất liệu vỏ</label>
                <input value={form.caseMaterial} onChange={e => handleChange('caseMaterial', e.target.value)} placeholder="VD: Stainless Steel" />
              </div>
              <div className="pf-field">
                <label>Kích thước vỏ</label>
                <input value={form.caseSize} onChange={e => handleChange('caseSize', e.target.value)} placeholder="VD: 41mm" />
              </div>
            </div>
            <div className="pf-row">
              <div className="pf-field">
                <label>Chất liệu dây</label>
                <input value={form.strapMaterial} onChange={e => handleChange('strapMaterial', e.target.value)} placeholder="VD: Leather" />
              </div>
              <div className="pf-field">
                <label>Chống nước</label>
                <input value={form.waterResistance} onChange={e => handleChange('waterResistance', e.target.value)} placeholder="VD: 100m" />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="pf-col pf-col--side">
          <section className="pf-section">
            <h2 className="pf-section__title">Hình ảnh</h2>
            <ImageUploader images={form.images} onChange={(imgs) => handleChange('images', imgs)} maxImages={5} />
          </section>

          <section className="pf-section">
            <h2 className="pf-section__title">Tuỳ chọn</h2>
            <label className="pf-checkbox">
              <input type="checkbox" checked={form.isFeatured} onChange={e => handleChange('isFeatured', e.target.checked)} />
              <span>Sản phẩm nổi bật</span>
            </label>
            <label className="pf-checkbox">
              <input type="checkbox" checked={form.isActive} onChange={e => handleChange('isActive', e.target.checked)} />
              <span>Hiển thị trên cửa hàng</span>
            </label>
          </section>

          <button type="submit" className="pf-submit" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo sản phẩm'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
