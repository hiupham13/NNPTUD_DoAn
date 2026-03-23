# 🧪 Testing Strategy

> Chiến lược testing cho Luxury Watch Store.

---

## Phương pháp

| Loại | Tool | Scope |
|:-----|:-----|:------|
| API Testing | Postman | Tất cả endpoints |
| Manual Testing | Browser | UI flows |
| Edge Case Testing | Postman + Manual | 45 edge cases |

## Test Priority (theo Business)

| Priority | Module | Reason |
|:---------|:-------|:-------|
| P1 | Auth | Không login = không mua được |
| P1 | Checkout flow | Core business flow |
| P1 | VNPay | Thanh toán phải chính xác |
| P1 | Order SNAPSHOT | Giá không được thay đổi |
| P1 | Delete Protection | Data integrity |
| P2 | CRUD modules | Standard functionality |
| P2 | Filter/Search | UX quality |
| P3 | Dashboard | Nice to have |

## Test Flows

### Critical Flow 1: Customer Purchase (COD)
```
Register → Login → Browse → Add to cart → Checkout (COD) → View order
```

### Critical Flow 2: Customer Purchase (VNPay)
```
Login → Add to cart → Checkout (VNPay) → Redirect → Return → Verify payment
```

### Critical Flow 3: SNAPSHOT Verification
```
1. Create order with Product A (price 1M)
2. Admin changes Product A price to 2M
3. Verify order still shows 1M ✅
4. Admin deletes Product A
5. Verify order still shows full info ✅
```

### Critical Flow 4: Delete Protection
```
1. Create Category "Rolex" with 3 products
2. Try delete Category → Should FAIL ❌
3. Delete all products in "Rolex"
4. Try delete Category → Should SUCCEED ✅
```
