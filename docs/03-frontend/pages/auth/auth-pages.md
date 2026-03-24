# 🔐 Auth Pages

> **Trạng thái**: ✅ DONE (D9 — 24/03/2026)
> **File code**: `frontend/src/pages/auth/`

---

## Tổng quan

4 trang xác thực, tất cả nằm trong `GuestRoute` (chỉ user chưa đăng nhập mới truy cập được).

| Page | File | Route | Guard |
|:-----|:-----|:------|:------|
| Đăng nhập | `LoginPage.tsx` | `/login` | Guest |
| Đăng ký | `RegisterPage.tsx` | `/register` | Guest |
| Quên mật khẩu | `ForgotPasswordPage.tsx` | `/forgot-password` | Guest |
| Đặt lại mật khẩu | `ResetPasswordPage.tsx` | `/reset-password/:token` | Guest |

---

## LoginPage.tsx (117 lines)

### Layout
- **Split layout**: Image trái 7/12 + Form phải 5/12 (responsive: stacked trên mobile)
- Animation: `animate-slide-in-right` (image) + `animate-slide-in-left` (form)
- Ảnh nền: Unsplash luxury watch, grayscale-hover effect
- Floating quote card trên ảnh: *"Vẻ đẹp vượt thời gian."* — slide trái khi hover
- Vertical label bên trái ảnh: "Đặc Quyền Hội Viên © 2026"

### Form
- **Validation**: React Hook Form + Zod (`zodResolver`)
  - `email`: string().email()
  - `password`: string().min(6)
- **Components**: Dùng reusable `<Input />` và `<Button variant="primary" />`
- **API**: `POST /api/v1/auth/login` → nhận `{ user, token }` → Zustand `login()` → navigate `/`
- **Toast**: `react-hot-toast` cho success/error
- **Liên kết**: "Quên mật khẩu?" + "Đăng ký tài khoản"
- **Footer**: "Kết nối bảo mật" + icon `ShieldCheck` (Lucide)

### UI Tiếng Việt
- ✅ Heading: "Đăng nhập *Tài khoản*"
- ✅ Labels: "Địa Chỉ Email", "Mật khẩu"
- ✅ Placeholders: "Nhập email của bạn", "Nhập mật khẩu"
- ✅ Button: "Đăng nhập"
- ✅ Error messages: Tiếng Việt (từ Zod schema)

---

## RegisterPage.tsx (106 lines)

### Layout
- **Split layout ngược**: Form trái 5/12 + Image phải 7/12 (asymmetric)
- Animation: `animate-slide-in-right` (form) + `animate-slide-in-left` (image)
- Ảnh nền: CSS background-image, grayscale → color hover 1500ms
- Vertical label góc phải dưới ảnh: "Heritage / Since 2026"

### Form
- **Validation**: React Hook Form + Zod
  - `name`: string().min(2)
  - `email`: string().email()
  - `password`: string().min(6)
- **Components**: `<Input />` × 3 + `<Button variant="outline" />`
- **API**: `POST /api/v1/auth/register` → nhận `{ user, token }` → auto login → navigate `/`
- **Footer**: "Đã có tài khoản?" + link "Đăng Nhập"

### UI Tiếng Việt
- ✅ Heading: "Tạo *Tài Khoản*"
- ✅ Subtitle: "Nhập thông tin ... thưởng lãm các bộ sưu tập giới hạn."
- ✅ Labels: "Họ và Tên", "Địa Chỉ Email", "Mật Khẩu"
- ✅ Button: "GIA NHẬP HỘI VIÊN"

---

## ForgotPasswordPage.tsx (67 lines)

### Layout
- **Centered single column**: max-w-md, nhẹ nhàng
- Không có ảnh, tập trung vào form

### Form
- **Validation**: email required
- **API**: `POST /api/v1/auth/forgot-password`
- **Button**: `<Button variant="outline" />` — "Gửi liên kết"
- **Liên kết**: "Quay lại Đăng nhập"

### UI Tiếng Việt
- ✅ Heading: "Khôi phục *Quyền truy cập*"
- ✅ Subtitle: "Nhập email để nhận liên kết khôi phục mật khẩu."

---

## ResetPasswordPage.tsx (71 lines)

### Layout
- Tương tự ForgotPasswordPage — centered single column

### Form
- **Validation**: password min 6
- **API**: `POST /api/v1/auth/reset-password/:token` (lấy từ `useParams()`)
- **Button**: `<Button variant="outline" />` — "Xác nhận mật khẩu"
- **Liên kết**: "Huỷ" → `/login`

### UI Tiếng Việt
- ✅ Heading: "Mật Khẩu *Mới*"
- ✅ Subtitle: "Thiết lập mật khẩu bảo mật mới cho tài khoản của bạn."

---

## Dependencies chung

| Package | Vai trò |
|:--------|:--------|
| `react-hook-form` | Form management |
| `zod` + `@hookform/resolvers` | Schema validation |
| `react-hot-toast` | Toast notifications |
| `react-router-dom` | Navigation, `useParams`, `Link` |
| `lucide-react` | Icons (ShieldCheck) |
| `../../components/ui/Input` | Reusable input component |
| `../../components/ui/Button` | Reusable button component |
| `../../stores/authStore` | Zustand auth state |
| `../../services/api` | Axios instance |
