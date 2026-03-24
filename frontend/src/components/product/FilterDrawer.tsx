import { X } from 'lucide-react';
import type { Category } from '../../types/product';
import { useCategories } from '../../hooks/useCategories';
import './FilterDrawer.css';

interface FilterState {
  category: string;
  gender: string;
  movement: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

const GENDER_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'unisex', label: 'Unisex' },
];

const MOVEMENT_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'automatic', label: 'Tự động' },
  { value: 'mechanical', label: 'Cơ học' },
  { value: 'quartz', label: 'Thạch anh' },
  { value: 'eco-drive', label: 'Eco-Drive' },
];

const PRICE_RANGES = [
  { label: 'Dưới 10 triệu', min: '', max: '10000000' },
  { label: '10 – 50 triệu', min: '10000000', max: '50000000' },
  { label: '50 – 100 triệu', min: '50000000', max: '100000000' },
  { label: '100 – 200 triệu', min: '100000000', max: '200000000' },
  { label: 'Trên 200 triệu', min: '200000000', max: '' },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
}: FilterDrawerProps) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const handlePriceRange = (min: string, max: string) => {
    onFilterChange('minPrice', min);
    onFilterChange('maxPrice', max);
  };

  const activePriceRange = PRICE_RANGES.findIndex(
    (r) => r.min === filters.minPrice && r.max === filters.maxPrice
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="filter-overlay" onClick={onClose} />}

      {/* Drawer */}
      <aside className={`filter-drawer ${isOpen ? 'filter-drawer--open' : ''}`}>
        <div className="filter-drawer__header">
          <h2 className="filter-drawer__title">Bộ Lọc</h2>
          <button className="filter-drawer__close" onClick={onClose} aria-label="Đóng">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="filter-drawer__body">
          {/* Thương hiệu */}
          <div className="filter-drawer__group">
            <h3 className="filter-drawer__group-title">Thương Hiệu</h3>
            <div className="filter-drawer__options">
              <button
                className={`filter-drawer__option ${!filters.category ? 'filter-drawer__option--active' : ''}`}
                onClick={() => onFilterChange('category', '')}
              >
                Tất cả
              </button>
              {categories.map((cat: Category) => (
                <button
                  key={cat._id}
                  className={`filter-drawer__option ${filters.category === cat._id ? 'filter-drawer__option--active' : ''}`}
                  onClick={() => onFilterChange('category', cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Giới tính */}
          <div className="filter-drawer__group">
            <h3 className="filter-drawer__group-title">Giới Tính</h3>
            <div className="filter-drawer__options">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`filter-drawer__option ${filters.gender === opt.value ? 'filter-drawer__option--active' : ''}`}
                  onClick={() => onFilterChange('gender', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bộ máy */}
          <div className="filter-drawer__group">
            <h3 className="filter-drawer__group-title">Bộ Máy</h3>
            <div className="filter-drawer__options">
              {MOVEMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`filter-drawer__option ${filters.movement === opt.value ? 'filter-drawer__option--active' : ''}`}
                  onClick={() => onFilterChange('movement', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div className="filter-drawer__group">
            <h3 className="filter-drawer__group-title">Khoảng Giá</h3>
            <div className="filter-drawer__options">
              <button
                className={`filter-drawer__option ${!filters.minPrice && !filters.maxPrice ? 'filter-drawer__option--active' : ''}`}
                onClick={() => handlePriceRange('', '')}
              >
                Tất cả
              </button>
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={i}
                  className={`filter-drawer__option ${activePriceRange === i ? 'filter-drawer__option--active' : ''}`}
                  onClick={() => handlePriceRange(range.min, range.max)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-drawer__footer">
          <button className="filter-drawer__clear" onClick={onClearAll}>
            Xoá bộ lọc
          </button>
          <button className="filter-drawer__apply" onClick={onClose}>
            Áp dụng
          </button>
        </div>
      </aside>
    </>
  );
}
