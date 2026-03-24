/**
 * Format giá tiền VNĐ
 * @example formatPrice(250000000) → "250.000.000₫"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

/**
 * Format giá tiền rút gọn (cho mobile / badge)
 * @example formatPriceShort(250000000) → "250tr"
 * @example formatPriceShort(5500000) → "5.5tr"
 */
export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}tr`;
  }
  return formatPrice(price);
}

/**
 * Map movement enum sang tiếng Việt
 */
export function formatMovement(movement: string): string {
  const map: Record<string, string> = {
    automatic: 'Tự động',
    mechanical: 'Cơ học',
    quartz: 'Thạch anh',
    'eco-drive': 'Eco-Drive',
    solar: 'Năng lượng mặt trời',
  };
  return map[movement] || movement;
}

/**
 * Map gender enum sang tiếng Việt
 */
export function formatGender(gender: string): string {
  const map: Record<string, string> = {
    male: 'Nam',
    female: 'Nữ',
    unisex: 'Unisex',
  };
  return map[gender] || gender;
}
