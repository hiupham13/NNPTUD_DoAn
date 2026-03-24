import { useState } from 'react';
import { Search, Save, AlertTriangle } from 'lucide-react';
import AdminTable, { type Column } from '../../components/admin/AdminTable';
import { useInventory, useUpdateStock } from '../../hooks/useInventoryAdmin';
import toast from 'react-hot-toast';
import './InventoryPage.css';

const LOW_STOCK_THRESHOLD = 5;

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const { data: items = [], isLoading } = useInventory(search);
  const updateStock = useUpdateStock();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id: string, currentStock: number) => {
    setEditingId(id);
    setEditValue(String(currentStock));
  };

  const saveEdit = (id: string) => {
    const stock = Number(editValue);
    if (isNaN(stock) || stock < 0) return toast.error('Số lượng không hợp lệ');
    updateStock.mutate({ id, stock }, {
      onSuccess: () => { toast.success('Cập nhật tồn kho thành công'); setEditingId(null); },
      onError: () => toast.error('Cập nhật thất bại'),
    });
  };

  const columns: Column<any>[] = [
    {
      key: 'image', title: 'Ảnh', width: '50px',
      render: (i) => <img src={i.productInfo?.images?.[0] || '/placeholder.png'} alt="" className="inv-thumb" />,
    },
    { key: 'name', title: 'Sản phẩm', render: (i) => i.productInfo?.name || '—' },
    { key: 'sku', title: 'SKU', width: '130px', render: (i) => <span className="inv-sku">{i.productInfo?.sku || '—'}</span> },
    {
      key: 'stock', title: 'Tồn kho', width: '120px',
      render: (i) => editingId === i._id ? (
        <div className="inv-edit">
          <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} className="inv-edit__input"
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(i._id); if (e.key === 'Escape') setEditingId(null); }} autoFocus />
          <button className="inv-edit__save" onClick={() => saveEdit(i._id)}><Save size={12} /></button>
        </div>
      ) : (
        <span className="inv-stock" onClick={() => startEdit(i._id, i.stock)}>
          {i.stock}
          {i.stock <= LOW_STOCK_THRESHOLD && <AlertTriangle size={13} className="inv-low" />}
        </span>
      ),
    },
    { key: 'reserved', title: 'Đang giữ', width: '90px', render: (i) => i.reserved || 0 },
    {
      key: 'available', title: 'Khả dụng', width: '90px',
      render: (i) => {
        const avail = i.stock - (i.reserved || 0);
        return <span className={avail <= 0 ? 'inv-zero' : ''}>{avail}</span>;
      },
    },
    { key: 'soldCount', title: 'Đã bán', width: '80px', render: (i) => i.soldCount || 0 },
  ];

  return (
    <div className="inventory-page">
      <h1 className="inventory-page__title">Quản lý tồn kho</h1>

      <div className="inventory-page__toolbar">
        <div className="inventory-page__search">
          <Search size={16} />
          <input type="text" placeholder="Tìm theo tên hoặc SKU..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <p className="inventory-page__hint">💡 Click vào số tồn kho để chỉnh sửa</p>
      </div>

      <AdminTable columns={columns} data={items} loading={isLoading} rowKey={(i: any) => i._id} emptyText="Chưa có dữ liệu tồn kho" />
    </div>
  );
}
