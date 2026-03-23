# Test Cases — Cart & Orders Module (D7)

> Trạng thái: ✅ Đã PASS qua Integration Test (`tests/integration/d7.integration.test.js`)

## 1. Cart Lifecycle
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Tiêu chuẩn |
|:---:|:---|:---|:---|:---|
| `CRT-01` | Thêm vào giỏ hàng | POST `/api/v1/cart`, `productId=X`, `quantity=2` | Array `items` tăng thêm 1 phần tử. | Giỏ hàng dạng First-Come-First-Serve, không trừ kho |
| `CRT-02` | Thêm trùng đồ rỗng | Gửi lại `productId=X`, `quantity=1` | Array length giữ 1, quantity cập nhật = 3 | Gộp item (EC-16) |
| `CRT-03` | Tính tiền tự động | Đợi gọi GET `/api/v1/cart` | Trả về `cartTotal` | Tính giá realtime từ `product.salePrice` |

## 2. Coupon Validation
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Tiêu chuẩn |
|:---:|:---|:---|:---|:---|
| `CPN-01` | Mã giảm % hợp lệ | Order = 2tr, Mã 10% max là 150k | Tính giảm 150k | Giới hạn mã giảm giá % |
| `CPN-02` | Mã lỗi chưa đủ Min | Order 1tr, Code yêu cầu 2tr | 400: `Đơn hàng tối thiểu phải từ 2M` | Bảo vệ shop |
| `CPN-03` | Áp mã giảm tiền tĩnh | Order 2tr, giảm tĩnh 50k | Tính giảm 50k | |
| `CPN-04` | Mã hết lượt | Nhập Code `usedCount == maxUses` | 400: `Mã đã hết lượt dùng` | |

## 3. Order Checkout (Lõi hệ thống)
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Tiêu chuẩn |
|:---:|:---|:---|:---|:---|
| `ORD-01` | Snapshot Product | Gọi checkout thành công | Order Item chứa `title`, `price`, `image` cứng. | Nếu hôm sau Sản phẩm gốc bị xoá hoặc tăng giá: Đơn cũ vẫn giữ nguyên giá mua. |
| `ORD-02` | Kiểm tra tồn kho | Checkout SP có stock=2 mà require=3 | 400: `không đủ số lượng tồn kho` | (EC-18) |
| `ORD-03` | Khóa trừ kho (Reserved) | Order thành công | `Inventory.reserved += 1`. Cart tự động làm sạch. | (EC-20) |
| `ORD-04` | Freeship Luxury | Đơn mua chiếc Rolex giá 50 triệu | `shippingFee = 0`, finalAmount = 50tr | Các đơn ít hơn bị tính ship mặc định 50k |

## 4. Admin Update Status
| Case ID | Tính năng | Input Test | Expected Output | Ghi chú / Tiêu chuẩn |
|:---:|:---|:---|:---|:---|
| `UPS-01` | Khách Huỷ đơn | Customer PUT `/api/v1/orders/1/cancel` | Status -> `cancelled`, `Inventory.reserved -= 1` | Kho được phục hồi lại về mức cũ |
| `UPS-02` | Admin Hoàn Thành đơn| Admin set status `completed` | `reserved -= QTY`, `stock -= QTY`, `soldCount += QTY` | Thực hạch toán (EC-20) trừ tiền mặt Kho |
| `UPS-03` | Bảo mật Huỷ | Khách huỷ đơn đã `shipping` | 400: `Đơn hàng đã được xử lý` | |
