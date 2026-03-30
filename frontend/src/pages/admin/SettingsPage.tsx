import { useState, useRef } from 'react';
import { Tags, FolderOpen, Ticket, Plus, Edit, Trash2, X, Save, FileSpreadsheet } from 'lucide-react';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import {
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useImportCategoryExcel,
  useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection, useImportCollectionExcel,
  useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon,
} from '../../hooks/useSettingsAdmin';
import toast from 'react-hot-toast';
import '../../components/admin/AdminToggle.css';
import './SettingsPage.css';

const TABS = [
  { key: 'categories', label: 'Thương hiệu', icon: Tags },
  { key: 'collections', label: 'Bộ sưu tập', icon: FolderOpen },
  { key: 'coupons', label: 'Mã giảm giá', icon: Ticket },
];

/* ==================== CATEGORY TAB ==================== */
function CategoryTab() {
  const { data: items = [], isLoading } = useCategories();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();
  const importMut = useImportCategoryExcel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<{ open: boolean; item?: any }>({ open: false });

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Đang Import Excel...');
    importMut.mutate(file, {
      onSuccess: (res: any) => {
        toast.success(res.message || 'Import thành công', { id: toastId });
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Lỗi khi import file Excel', { id: toastId });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openCreate = () => { setName(''); setDescription(''); setModal({ open: true }); };
  const openEdit = (item: any) => { setName(item.name); setDescription(item.description || ''); setModal({ open: true, item }); };

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Vui lòng nhập tên');
    const payload = { name: name.trim(), description };
    try {
      if (modal.item) {
        await updateMut.mutateAsync({ id: modal.item._id, payload });
        toast.success('Cập nhật thành công');
      } else {
        await createMut.mutateAsync(payload);
        toast.success('Tạo thành công');
      }
      setModal({ open: false });
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const handleDelete = (id: string, n: string) => {
    if (!confirm(`Xoá "${n}"?`)) return;
    deleteMut.mutate(id, { onSuccess: () => toast.success('Đã xoá'), onError: () => toast.error('Xoá thất bại') });
  };

  const columns: Column<any>[] = [
    { key: 'name', title: 'Tên' },
    { key: 'slug', title: 'Slug', width: '200px' },
    { key: 'description', title: 'Mô tả', render: (i) => i.description || '—' },
    {
      key: 'actions', title: '', width: '80px',
      render: (i) => (
        <div className="stg-actions">
          <button onClick={() => openEdit(i)}><Edit size={14} /></button>
          <button className="stg-actions--del" onClick={() => handleDelete(i._id, i.name)}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="stg-tab-header">
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleImportExcel} style={{ display: 'none' }} />
          <button className="stg-add" style={{ backgroundColor: '#217346' }} onClick={() => fileInputRef.current?.click()} disabled={importMut.isPending}>
             <FileSpreadsheet size={14} /> Import Excel
          </button>
          <button className="stg-add" onClick={openCreate}><Plus size={14} /> Thêm thương hiệu</button>
        </div>
      </div>
      <AdminTable columns={columns} data={items} loading={isLoading} rowKey={(i: any) => i._id} emptyText="Chưa có thương hiệu" />
      {modal.open && <SettingsModal title={modal.item ? 'Sửa thương hiệu' : 'Thêm thương hiệu'} onClose={() => setModal({ open: false })} onSave={handleSave} saving={createMut.isPending || updateMut.isPending}>
        <div className="stg-field"><label>Tên *</label><input value={name} onChange={e => setName(e.target.value)} autoFocus /></div>
        <div className="stg-field"><label>Mô tả</label><input value={description} onChange={e => setDescription(e.target.value)} /></div>
      </SettingsModal>}
    </>
  );
}

/* ==================== COLLECTION TAB ==================== */
function CollectionTab() {
  const { data: items = [], isLoading } = useCollections();
  const createMut = useCreateCollection();
  const updateMut = useUpdateCollection();
  const deleteMut = useDeleteCollection();
  const importMut = useImportCollectionExcel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<{ open: boolean; item?: any }>({ open: false });

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Đang Import Excel...');
    importMut.mutate(file, {
      onSuccess: (res: any) => {
        toast.success(res.message || 'Import thành công', { id: toastId });
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Lỗi khi import file Excel', { id: toastId });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openCreate = () => { setName(''); setDescription(''); setModal({ open: true }); };
  const openEdit = (item: any) => { setName(item.name); setDescription(item.description || ''); setModal({ open: true, item }); };

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Vui lòng nhập tên');
    const payload = { name: name.trim(), description };
    try {
      if (modal.item) {
        await updateMut.mutateAsync({ id: modal.item._id, payload });
        toast.success('Cập nhật thành công');
      } else {
        await createMut.mutateAsync(payload);
        toast.success('Tạo thành công');
      }
      setModal({ open: false });
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const handleDelete = (id: string, n: string) => {
    if (!confirm(`Xoá "${n}"?`)) return;
    deleteMut.mutate(id, { onSuccess: () => toast.success('Đã xoá'), onError: () => toast.error('Xoá thất bại') });
  };

  const columns: Column<any>[] = [
    { key: 'name', title: 'Tên' },
    { key: 'slug', title: 'Slug', width: '200px' },
    { key: 'description', title: 'Mô tả', render: (i) => i.description || '—' },
    {
      key: 'actions', title: '', width: '80px',
      render: (i) => (
        <div className="stg-actions">
          <button onClick={() => openEdit(i)}><Edit size={14} /></button>
          <button className="stg-actions--del" onClick={() => handleDelete(i._id, i.name)}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="stg-tab-header">
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleImportExcel} style={{ display: 'none' }} />
          <button className="stg-add" style={{ backgroundColor: '#217346' }} onClick={() => fileInputRef.current?.click()} disabled={importMut.isPending}>
             <FileSpreadsheet size={14} /> Import Excel
          </button>
          <button className="stg-add" onClick={openCreate}><Plus size={14} /> Thêm bộ sưu tập</button>
        </div>
      </div>
      <AdminTable columns={columns} data={items} loading={isLoading} rowKey={(i: any) => i._id} emptyText="Chưa có bộ sưu tập" />
      {modal.open && <SettingsModal title={modal.item ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập'} onClose={() => setModal({ open: false })} onSave={handleSave} saving={createMut.isPending || updateMut.isPending}>
        <div className="stg-field"><label>Tên *</label><input value={name} onChange={e => setName(e.target.value)} autoFocus /></div>
        <div className="stg-field"><label>Mô tả</label><input value={description} onChange={e => setDescription(e.target.value)} /></div>
      </SettingsModal>}
    </>
  );
}

/* ==================== COUPON TAB ==================== */
function CouponTab() {
  const { data: items = [], isLoading } = useCoupons();
  const createMut = useCreateCoupon();
  const updateMut = useUpdateCoupon();
  const deleteMut = useDeleteCoupon();
  const [modal, setModal] = useState<{ open: boolean; item?: any }>({ open: false });
  const [form, setForm] = useState({ code: '', discountType: 'percent', discountValue: '', minOrderAmount: '', maxDiscount: '', maxUses: '', expiresAt: '', isActive: true });

  const openCreate = () => { setForm({ code: '', discountType: 'percent', discountValue: '', minOrderAmount: '', maxDiscount: '', maxUses: '', expiresAt: '', isActive: true }); setModal({ open: true }); };
  const openEdit = (item: any) => {
    setForm({
      code: item.code || '', discountType: item.discountType || 'percent',
      discountValue: String(item.discountValue || ''), minOrderAmount: String(item.minOrderAmount || ''),
      maxDiscount: String(item.maxDiscount || ''), maxUses: String(item.maxUses || ''),
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : '',
      isActive: item.isActive !== false,
    });
    setModal({ open: true, item });
  };

  const handleSave = async () => {
    if (!form.code.trim()) return toast.error('Nhập mã giảm giá');
    if (!form.discountValue) return toast.error('Nhập giá trị giảm');
    const payload = {
      code: form.code.toUpperCase().trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      maxUses: Number(form.maxUses) || 0,
      expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
      isActive: form.isActive,
    };
    try {
      if (modal.item) {
        await updateMut.mutateAsync({ id: modal.item._id, payload });
        toast.success('Cập nhật thành công');
      } else {
        await createMut.mutateAsync(payload);
        toast.success('Tạo thành công');
      }
      setModal({ open: false });
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Xoá mã "${code}"?`)) return;
    deleteMut.mutate(id, { onSuccess: () => toast.success('Đã xoá'), onError: () => toast.error('Xoá thất bại') });
  };

  const formatVND = (v: number) => v ? new Intl.NumberFormat('vi-VN').format(v) : '—';

  const columns: Column<any>[] = [
    { key: 'code', title: 'Mã', render: (i) => <span className="coupon-code">{i.code}</span> },
    {
      key: 'discount', title: 'Giảm giá', width: '120px',
      render: (i) => i.discountType === 'percent' ? `${i.discountValue}%` : formatVND(i.discountValue) + ' ₫',
    },
    { key: 'minOrderAmount', title: 'Đơn tối thiểu', width: '130px', render: (i) => formatVND(i.minOrderAmount) },
    { key: 'usage', title: 'Đã dùng', width: '80px', render: (i) => `${i.usedCount || 0}/${i.maxUses || '∞'}` },
    {
      key: 'expiresAt', title: 'Hết hạn', width: '110px',
      render: (i) => i.expiresAt ? new Date(i.expiresAt).toLocaleDateString('vi-VN') : '—',
    },
    {
      key: 'isActive', title: 'Bật', width: '60px',
      render: (i) => (
        <label className="admin-toggle">
          <input type="checkbox" checked={i.isActive}
            onChange={() => updateMut.mutate({ id: i._id, payload: { isActive: !i.isActive } },
              { onSuccess: () => toast.success(i.isActive ? 'Đã tắt mã' : 'Đã bật mã') })} />
          <span className="admin-toggle__slider" />
        </label>
      ),
    },
    {
      key: 'actions', title: '', width: '80px',
      render: (i) => (
        <div className="stg-actions">
          <button onClick={() => openEdit(i)}><Edit size={14} /></button>
          <button className="stg-actions--del" onClick={() => handleDelete(i._id, i.code)}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  const setField = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <>
      <div className="stg-tab-header">
        <button className="stg-add" onClick={openCreate}><Plus size={14} /> Thêm mã giảm giá</button>
      </div>
      <AdminTable columns={columns} data={items} loading={isLoading} rowKey={(i: any) => i._id} emptyText="Chưa có mã giảm giá" />
      {modal.open && <SettingsModal title={modal.item ? 'Sửa mã' : 'Thêm mã giảm giá'} onClose={() => setModal({ open: false })} onSave={handleSave} saving={createMut.isPending || updateMut.isPending}>
        <div className="stg-field"><label>Mã *</label><input value={form.code} onChange={e => setField('code', e.target.value)} placeholder="VD: SALE20" autoFocus /></div>
        <div className="stg-row">
          <div className="stg-field"><label>Loại giảm</label>
            <select value={form.discountType} onChange={e => setField('discountType', e.target.value)}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (₫)</option>
            </select>
          </div>
          <div className="stg-field"><label>Giá trị *</label><input type="number" value={form.discountValue} onChange={e => setField('discountValue', e.target.value)} /></div>
        </div>
        <div className="stg-row">
          <div className="stg-field"><label>Đơn tối thiểu</label><input type="number" value={form.minOrderAmount} onChange={e => setField('minOrderAmount', e.target.value)} /></div>
          <div className="stg-field"><label>Giảm tối đa</label><input type="number" value={form.maxDiscount} onChange={e => setField('maxDiscount', e.target.value)} /></div>
        </div>
        <div className="stg-row">
          <div className="stg-field"><label>Số lượt dùng</label><input type="number" value={form.maxUses} onChange={e => setField('maxUses', e.target.value)} placeholder="0 = Không giới hạn" /></div>
          <div className="stg-field"><label>Ngày hết hạn</label><input type="date" value={form.expiresAt} onChange={e => setField('expiresAt', e.target.value)} /></div>
        </div>
        <label className="stg-checkbox"><input type="checkbox" checked={form.isActive} onChange={e => setField('isActive', e.target.checked)} /><span>Kích hoạt</span></label>
      </SettingsModal>}
    </>
  );
}

/* ==================== MODAL SHARED ==================== */
function SettingsModal({ title, onClose, onSave, saving, children }: { title: string; onClose: () => void; onSave: () => void; saving: boolean; children: React.ReactNode }) {
  return (
    <div className="stg-modal-overlay" onClick={onClose}>
      <div className="stg-modal" onClick={e => e.stopPropagation()}>
        <div className="stg-modal__header">
          <h3>{title}</h3>
          <button onClick={onClose}><X size={16} /></button>
        </div>
        <div className="stg-modal__body">{children}</div>
        <div className="stg-modal__footer">
          <button className="stg-modal__cancel" onClick={onClose}>Huỷ</button>
          <button className="stg-modal__save" onClick={onSave} disabled={saving}><Save size={14} /> {saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function SettingsPage() {
  const [tab, setTab] = useState('categories');

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">Cài đặt</h1>

      <div className="settings-page__tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`settings-tab ${tab === t.key ? 'settings-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <t.icon size={16} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-page__content">
        {tab === 'categories' && <CategoryTab />}
        {tab === 'collections' && <CollectionTab />}
        {tab === 'coupons' && <CouponTab />}
      </div>
    </div>
  );
}
