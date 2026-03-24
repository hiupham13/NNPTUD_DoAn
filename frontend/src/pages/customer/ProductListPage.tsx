import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/product/ProductCard';
import FilterDrawer from '../../components/product/FilterDrawer';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import SortDropdown from '../../components/common/SortDropdown';
import type { ProductFilter } from '../../types/product';
import './ProductListPage.css';

export default function ProductListPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    movement: '',
    minPrice: '',
    maxPrice: '',
  });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Build query params
  const params: ProductFilter = {
    page,
    limit: 12,
    sort: sort as ProductFilter['sort'],
  };
  if (search) params.search = search;
  if (filters.category) params.category = filters.category;
  if (filters.gender) params.gender = filters.gender;
  if (filters.movement) params.movement = filters.movement;
  if (filters.minPrice) params.minPrice = Number(filters.minPrice);
  if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);

  const { data, isLoading } = useProducts(params);
  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset page khi đổi filter
  };

  const handleClearAll = () => {
    setFilters({ category: '', gender: '', movement: '', minPrice: '', maxPrice: '' });
    setSearch('');
    setPage(1);
  };

  // Đếm số filter active
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="product-list">
      {/* Header */}
      <div className="product-list__header">
        <div className="product-list__header-left">
          <h1 className="product-list__title">Bộ Sưu Tập</h1>
          <p className="product-list__subtitle">
            {pagination ? `${pagination.total} sản phẩm` : 'Đang tải...'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="product-list__toolbar">
        <div className="product-list__toolbar-left">
          <button
            className="product-list__filter-btn"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} />
            <span>Bộ lọc</span>
            {activeFilterCount > 0 && (
              <span className="product-list__filter-count">{activeFilterCount}</span>
            )}
          </button>
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        </div>
        <SortDropdown value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="product-list__loading">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="product-list__empty">
          <p>Không tìm thấy sản phẩm nào</p>
          <button onClick={handleClearAll} className="product-list__clear-btn">
            Xoá bộ lọc
          </button>
        </div>
      ) : (
        <div className="product-list__grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
