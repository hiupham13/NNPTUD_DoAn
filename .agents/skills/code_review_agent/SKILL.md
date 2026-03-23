---
name: code_review_agent
description: Code Review Agent (lấy cảm hứng từ CodeRabbit) — Review code tự động, phát hiện bugs, security issues, performance, best practices sau khi code xong.
---

# 🐰 Code Review Agent — E-Commerce NNPTUD

> **Lấy cảm hứng từ CodeRabbit** — Một agent review code tự động, cung cấp feedback chi tiết theo dòng code như một reviewer thực thụ.

## 1. VAI TRÒ
- Review code sau khi hoàn thành (post-coding review).
- Phát hiện bugs, logic errors, security vulnerabilities.
- Đánh giá code quality, performance, best practices.
- Đề xuất cải tiến cụ thể với code examples.

## 2. KHI NÀO KÍCH HOẠT

Skill này được sử dụng khi:
- User yêu cầu: _"review code"_, _"kiểm tra code"_, _"đánh giá code"_
- Sau khi hoàn thành một module/feature mới
- Trước khi commit/merge code quan trọng
- Khi cần audit toàn bộ codebase

## 3. QUY TRÌNH REVIEW — 7 LAYERS

### Layer 1: 🐛 Bugs & Logic Errors
```
Checklist:
□ Null/undefined reference errors
□ Off-by-one errors (loops, pagination)
□ Race conditions trong async code
□ Unhandled promise rejections
□ Type mismatches
□ Logic sai trong conditions (if/else)
□ Missing return statements
□ Infinite loops hoặc recursive calls không có base case
```

**Ví dụ phát hiện bug:**
```javascript
// ❌ BUG: Quên await → result luôn là Promise, không phải data
const getProduct = async (req, res) => {
  const product = Product.findById(req.params.id); // thiếu await
  res.json({ success: true, data: product });
};

// ✅ FIX:
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ success: true, data: product });
};
```

### Layer 2: 🔒 Security Vulnerabilities
```
Checklist:
□ NoSQL Injection (MongoDB query injection)
□ XSS (Cross-Site Scripting) — user input không sanitize
□ Hardcoded secrets (API keys, passwords trong code)
□ Missing authentication trên protected routes
□ Missing authorization (role check)
□ JWT không verify đúng cách
□ Password không hash trước khi lưu
□ File upload không validate type/size
□ CORS quá rộng (allow all origins)
□ Sensitive data trong response (password, tokens)
□ Rate limiting thiếu trên auth endpoints
```

**Ví dụ phát hiện security issue:**
```javascript
// ❌ SECURITY: NoSQL Injection — user input trực tiếp vào query
router.get('/users', async (req, res) => {
  const users = await User.find({ username: req.query.username });
  // Attacker gửi: ?username[$ne]=null → trả về tất cả users!
});

// ✅ FIX: Sanitize input
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
// Hoặc manual: chỉ accept string
const username = typeof req.query.username === 'string' ? req.query.username : '';
```

### Layer 3: ⚡ Performance Issues
```
Checklist:
□ N+1 query problem (query trong loop)
□ Missing indexes cho query thường dùng
□ Fetch toàn bộ data rồi filter trong JS (thay vì MongoDB query)
□ Không dùng pagination cho list APIs
□ Không dùng .lean() cho read-only queries
□ Populate quá nhiều levels (deep populate)
□ Không dùng .select() — trả về tất cả fields
□ Thiếu compression middleware
□ Frontend: Re-renders không cần thiết
□ Frontend: Bundle size quá lớn (import toàn bộ library)
```

**Ví dụ phát hiện performance issue:**
```javascript
// ❌ PERFORMANCE: Fetch all rồi filter trong JS
router.get('/products', async (req, res) => {
  let data = await Product.find({});              // Fetch TẤT CẢ
  let result = data.filter(e => !e.isDeleted);    // Filter trong JS!
  result = result.splice(limit * (page - 1), limit);
  res.send(result);
});

// ✅ FIX: Filter trong MongoDB, chỉ fetch cần thiết
router.get('/products', async (req, res) => {
  const result = await Product.find({ isDeleted: false })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  res.json({ success: true, data: result });
});
```

### Layer 4: 📏 Code Quality & Standards
```
Checklist:
□ Naming conventions (camelCase, PascalCase)
□ Response format nhất quán ({ success, data, message })
□ Error handling: try/catch cho mọi async function
□ Soft delete pattern (isDeleted thay vì deleteOne)
□ Code duplication (DRY principle)
□ Function quá dài (> 50 dòng → nên tách)
□ Magic numbers/strings (nên dùng constants)
□ console.log() còn lại trong production code
□ var → nên dùng const/let
□ Callback hell → nên dùng async/await
```

### Layer 5: 🧪 Test Coverage
```
Checklist:
□ Có test cho happy path?
□ Có test cho error cases?
□ Có test cho edge cases?
□ Có test cho authentication/authorization?
□ Có test cho validation?
□ Controller functions có unit test?
□ API endpoints có integration test?
```

### Layer 6: 📚 Documentation & Readability
```
Checklist:
□ Functions phức tạp có comment giải thích?
□ API endpoints có mô tả input/output?
□ Business logic có comment lý do?
□ README cập nhật?
□ Environment variables có document?
□ Code tự giải thích (self-documenting)?
```

### Layer 7: 🏗️ Architecture & Design
```
Checklist:
□ Separation of concerns (Route → Controller → Service → Model)
□ Không có business logic trong routes
□ Middleware được tách riêng và reusable
□ DRY — không repeat code
□ Single Responsibility Principle
□ Dependency injection khi cần
□ Error handling tập trung
□ Config tách riêng (.env, config files)
```

## 4. OUTPUT FORMAT — BÁO CÁO REVIEW

Khi review, output theo format sau (hiển thị trong chat, KHÔNG tạo file):

```markdown
## 🐰 Code Review Report

### 📊 Tổng Quan
| Metric | Kết quả |
|:-------|:--------|
| Files reviewed | X files |
| Severity: 🔴 Critical | X issues |
| Severity: 🟡 Warning | X issues |
| Severity: 🔵 Info | X suggestions |
| Overall Score | X/10 |

---

### 🔴 Critical Issues (phải fix)

#### [C1] File: `routes/products.js` — Line 12
**Category**: 🔒 Security
**Issue**: NoSQL injection vulnerability
**Current code**:
```js
// code hiện tại
```
**Suggested fix**:
```js
// code đề xuất
```
**Explanation**: ...

---

### 🟡 Warnings (nên fix)

#### [W1] File: `controllers/orders.js` — Line 45
**Category**: ⚡ Performance
**Issue**: N+1 query in loop
...

---

### 🔵 Suggestions (optional)

#### [S1] File: `schemas/products.js`
**Category**: 📏 Code Quality
**Suggestion**: ...

---

### ✅ Điểm Tốt
- [Liệt kê những phần code tốt]

### 📈 Recommendations
1. [Đề xuất cải thiện tổng thể]
```

## 5. SEVERITY LEVELS

| Level | Icon | Mô tả | Action |
|:------|:-----|:------|:-------|
| Critical | 🔴 | Bug nghiêm trọng, security hole, data loss | **PHẢI fix** trước khi deploy |
| Warning | 🟡 | Performance issue, code smell, minor bug | **NÊN fix** sớm |
| Info | 🔵 | Suggestion, best practice, improvement | **Optional**, nice to have |

## 6. SCORING SYSTEM

| Score | Rating | Mô tả |
|:------|:-------|:------|
| 9-10 | ⭐ Excellent | Code sạch, ít issues, follow best practices |
| 7-8 | ✅ Good | Đạt yêu cầu, có vài warnings nhỏ |
| 5-6 | ⚠️ Average | Nhiều warnings, cần refactor |
| 3-4 | ❌ Poor | Có critical issues, cần fix ngay |
| 1-2 | 🚫 Critical | Nhiều bugs và security holes |

## 7. REVIEW COMMANDS

User có thể yêu cầu review theo các cách:

| Lệnh | Scope |
|:------|:------|
| _"Review file X"_ | Review 1 file cụ thể |
| _"Review module X"_ | Review toàn bộ module (schema + route + controller) |
| _"Review security"_ | Chỉ check security issues |
| _"Review performance"_ | Chỉ check performance issues |
| _"Review toàn bộ"_ | Review toàn bộ codebase |
| _"Quick review"_ | Chỉ check Critical + Warning, bỏ qua Info |

## 8. CONTEXT-AWARE REVIEW

Khi review, agent PHẢI:
1. **Đọc skill liên quan** để biết conventions chuẩn (nodejs_express_expert, mongodb_expert, react_typescript_expert).
2. **Đọc codebase GV** để phân biệt code gốc vs code mới (không review code gốc GV trừ khi user yêu cầu).
3. **Hiểu business rules** từ business_analyst skill.
4. **So sánh với patterns** đã định nghĩa trong skills.
