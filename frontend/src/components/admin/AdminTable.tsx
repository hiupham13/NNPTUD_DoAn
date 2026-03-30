import type { ReactNode } from 'react';
import './AdminTable.css';

export interface Column<T> {
  key: string;
  title: ReactNode | string;
  render?: (item: T) => ReactNode;
  width?: string;
  sortable?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  rowKey?: (item: T) => string;
  onRowClick?: (item: T) => void;
}

export default function AdminTable<T>({ columns, data, loading, emptyText, rowKey, onRowClick }: AdminTableProps<T>) {
  if (loading) {
    return <div className="admin-table__loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="admin-table__wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="admin-table__empty">
                {emptyText || 'Không có dữ liệu'}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={rowKey ? rowKey(item) : idx}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'admin-table__row--clickable' : ''}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(item)
                      : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
