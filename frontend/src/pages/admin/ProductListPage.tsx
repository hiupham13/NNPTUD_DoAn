import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, FileSpreadsheet } from 'lucide-react';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { useAdminProducts, useDeleteProduct, useUpdateProduct, useImportExcelProduct, useBulkDeleteProducts } from '../../hooks/useProductAdmin';
import toast from 'react-hot-toast';
import '../../components/admin/AdminToggle.css';
import './ProductListPage.css';

export default function ProductListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({ search, page, limit: 15 });
  const deleteMutation = useDeleteProduct();
  const bulkDeleteMutation = useBulkDeleteProducts();
  const updateMutation = useUpdateProduct();
  const importMutation = useImportExcelProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const toastId = toast.loading('Đang xử lý file Excel...');
    importMutation.mutate(file, {
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

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
         toast.success('Đã xóa sản phẩm');
         setSelectedIds(prev => prev.filter(i => i !== id));
      },
      onError: () => toast.error('Xóa thất bại'),
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) return;
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`Đã xóa ${selectedIds.length} sản phẩm`);
        setSelectedIds([]);
      },
      onError: () => toast.error('Xóa thất bại'),
    });
  };

  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const handleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(products.map((p: any) => p._id));
  };

  const handleSelectProduct = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const formatVND = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const columns: Column<any>[] = [
    {
      key: 'checkbox',
      title: (
        <input 
          type="checkbox" 
          checked={isAllSelected} 
          onChange={handleSelectAll} 
          disabled={products.length === 0}
        />
      ),
      width: '40px',
      render: (p) => (
        <input 
          type="checkbox" 
          checked={selectedIds.includes(p._id)} 
          onChange={() => handleSelectProduct(p._id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: 'image',
      title: 'Ảnh',
      width: '60px',
      render: (p) => (
        <img
          src={p.images?.[0] || '/placeholder.png'}
          alt={p.name}
          className="product-list__thumb"
        />
      ),
    },
    { key: 'name', title: 'Tên sản phẩm' },
    { key: 'sku', title: 'SKU', width: '120px' },
    {
      key: 'category',
      title: 'Thương hiệu',
      render: (p) => p.category?.name || '—',
    },
    {
      key: 'price',
      title: 'Giá bán',
      width: '140px',
      render: (p) => formatVND(p.salePrice || p.price),
    },
    {
      key: 'isActive',
      title: 'Hiển thị',
      width: '70px',
      render: (p) => (
        <label className="admin-toggle" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={p.isActive}
            onChange={() => updateMutation.mutate({ id: p._id, payload: { isActive: !p.isActive } },
              { onSuccess: () => toast.success(p.isActive ? 'Đã ẩn sản phẩm' : 'Đã hiển thị sản phẩm') })} />
          <span className="admin-toggle__slider" />
        </label>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: '100px',
      render: (p) => (
        <div className="product-list__actions">
          <button className="product-list__btn--edit" onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${p._id}/edit`); }}>
            <Edit size={14} />
          </button>
          <button className="product-list__btn--delete" onClick={(e) => { e.stopPropagation(); handleDelete(p._id, p.name); }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-list">
      <div className="product-list__header">
        <h1 className="product-list__title">Quản lý sản phẩm</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleImportExcel} 
            style={{ display: 'none' }} 
          />
          <button 
            className="product-list__add" 
            style={{ backgroundColor: '#217346' }}
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
          >
             <FileSpreadsheet size={16} />
             <span>{importMutation.isPending ? 'Đang Import...' : 'Import Excel'}</span>
          </button>
          
          {selectedIds.length > 0 && (
            <button 
              className="product-list__add" 
              style={{ backgroundColor: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              <Trash2 size={16} />
              <span>{bulkDeleteMutation.isPending ? 'Đang xóa...' : `Xóa ${selectedIds.length} dòng`}</span>
            </button>
          )}

          <Link to="/admin/products/new" className="product-list__add">
            <Plus size={16} />
            <span>Thêm sản phẩm</span>
          </Link>
        </div>
      </div>

      <div className="product-list__toolbar">
        <div className="product-list__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={products}
        loading={isLoading}
        rowKey={(p: any) => p._id}
        emptyText="Chưa có sản phẩm nào"
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="product-list__pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              className={`product-list__page ${page === i + 1 ? 'product-list__page--active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
