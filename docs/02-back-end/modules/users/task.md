# 📝 Task List — D5: Users + Categories + Collections

> **Tham chiếu**: [`implementation_plan.md`](./implementation_plan.md)
> **Ngày**: D5 — 24/03/2026
> **Trạng thái**: ☐ CHƯA BẮT ĐẦU

---

## PHASE A: Users Module

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| A1 | `getProfile()` — GET /users/profile | 🔴 | ☐ | `controllers/user.controller.js` |
| A2 | `updateProfile()` — PUT /users/profile | 🟡 | ☐ | `controllers/user.controller.js` |
| A3 | `changePassword()` — PUT /users/change-password | 🟡 | ☐ | `controllers/user.controller.js` |
| A4 | `getUsers()` — GET /users (Admin, pagination) | 🔴 | ☐ | `controllers/user.controller.js` |
| A5 | `toggleStatus()` — PUT /users/:id/toggle-status (Admin) | 🟡 | ☐ | `controllers/user.controller.js` |
| A6 | Cập nhật `routes/users.routes.js` — 5 routes | 🔴 | ☐ | `routes/users.routes.js` |

---

## PHASE B: Categories Module (Brands)

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| B1 | `getAll()` — GET /categories (Public, +productCount) | 🔴 | ☐ | `controllers/category.controller.js` |
| B2 | `getBySlug()` — GET /categories/:slug | 🔴 | ☐ | `controllers/category.controller.js` |
| B3 | `create()` — POST /categories (Admin) | 🔴 | ☐ | `controllers/category.controller.js` |
| B4 | `update()` — PUT /categories/:id (Admin) | 🔴 | ☐ | `controllers/category.controller.js` |
| B5 | `delete()` — DELETE /categories/:id (Admin, EC-01) | 🔴 | ☐ | `controllers/category.controller.js` |
| B6 | Cập nhật `routes/categories.routes.js` — 5 routes | 🔴 | ☐ | `routes/categories.routes.js` |

---

## PHASE C: Collections Module (BST)

| # | Task | Priority | Status | File |
|:--|:-----|:---------|:-------|:-----|
| C1 | `getAll()` — GET /collections (Public, isActive filter) | 🟡 | ☐ | `controllers/collection.controller.js` |
| C2 | `getBySlug()` — GET /collections/:slug | 🟡 | ☐ | `controllers/collection.controller.js` |
| C3 | `create()` — POST /collections (Admin) | 🟡 | ☐ | `controllers/collection.controller.js` |
| C4 | `update()` — PUT /collections/:id (Admin) | 🟡 | ☐ | `controllers/collection.controller.js` |
| C5 | `delete()` — DELETE /collections/:id (Admin, BR-19) | 🟡 | ☐ | `controllers/collection.controller.js` |
| C6 | Cập nhật `routes/collections.routes.js` — 5 routes | 🟡 | ☐ | `routes/collections.routes.js` |

---

## PHASE D: Test

| # | Task | Priority | Status | Test |
|:--|:-----|:---------|:-------|:-----|
| D1 | Test GET /users/profile (Customer token) | 🔴 | ☐ | |
| D2 | Test PUT /users/profile | 🟡 | ☐ | |
| D3 | Test PUT /users/change-password | 🟡 | ☐ | |
| D4 | Test GET /users (Admin, pagination) | 🔴 | ☐ | |
| D5 | Test PUT /users/:id/toggle-status (BR-07) | 🟡 | ☐ | |
| D6 | Test CRUD /categories (Public + Admin) | 🔴 | ☐ | |
| D7 | Test DELETE /categories — EC-01 protection | 🔴 | ☐ | |
| D8 | Test CRUD /collections | 🟡 | ☐ | |
| D9 | Test DELETE /collections — BR-19 nullify | 🟡 | ☐ | |

---

## PHASE E: Docs Update

| # | Task | Priority | Status |
|:--|:-----|:---------|:-------|
| E1 | Tick task.md (root) — D5 tasks | 🔴 | ☐ |
| E2 | Cập nhật PROGRESS.md | 🔴 | ☐ |
| E3 | Cập nhật module docs nếu thay đổi | 🟡 | ☐ |

---

## THỐNG KÊ

| Phase | Tasks | P1 🔴 | P2 🟡 |
|:------|:------|:------|:------|
| A: Users | 6 | 2 | 4 |
| B: Categories | 6 | 6 | 0 |
| C: Collections | 6 | 0 | 6 |
| D: Test | 9 | 4 | 5 |
| E: Docs | 3 | 2 | 1 |
| **TỔNG** | **30** | **14** | **16** |

---

## PROGRESS

```
Phase A: ░░░░░░░░░░  0% (0/6)
Phase B: ░░░░░░░░░░  0% (0/6)
Phase C: ░░░░░░░░░░  0% (0/6)
Phase D: ░░░░░░░░░░  0% (0/9)
Phase E: ░░░░░░░░░░  0% (0/3)
────────────────────────────────
TOTAL:   ░░░░░░░░░░  0% (0/30)
```
