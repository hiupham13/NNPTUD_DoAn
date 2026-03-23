---
name: fullstack_module_generator
description: Code Gen Engine — Tạo module CRUD mới nhanh chóng, gen code toàn stack từ Schema → Route → Controller → React Page.
---

# 🚀 Fullstack Module Generator — E-Commerce NNPTUD

## 1. VAI TRÒ
- Tạo nhanh module CRUD mới cho cả Backend và Frontend.
- Generate code theo đúng pattern, convention đã định nghĩa.
- Đảm bảo tính nhất quán (consistency) giữa các module.

## 2. QUY TRÌNH TẠO MODULE MỚI

### Input cần nhận:
```
Module Name: [tên module, ví dụ: "reviews"]
Fields: [danh sách fields + types]
Relations: [references đến collection khác]
Features: [CRUD + custom features]
Access: [public / auth required / admin only]
```

### Output sẽ tạo:

#### Backend (6 files):
```
1. schemas/[module].js           — Mongoose Schema
2. controllers/[module].controller.js  — Controller logic
3. routes/[module].js            — Route definitions
4. middlewares/ (nếu cần)        — Custom middleware
5. Cập nhật app.js               — Register route mới
```

#### Frontend (5+ files):
```
1. types/[module].types.ts       — TypeScript interfaces
2. api/[module].api.ts           — API functions
3. hooks/use[Module].ts          — TanStack Query hooks
4. pages/[Module]/index.tsx      — List page
5. pages/[Module]/[Module]Detail.tsx  — Detail page
6. components/[Module]Card.tsx   — Card component (nếu cần)
7. components/[Module]Form.tsx   — Create/Edit form
```

## 3. TEMPLATE — BACKEND

### 3.1. Schema Template
```javascript
// schemas/{{modulePlural}}.js
const mongoose = require('mongoose');

const {{moduleSingular}}Schema = new mongoose.Schema(
  {
    {{#each fields}}
    {{name}}: {
      type: {{type}},
      {{#if required}}required: [true, '{{label}} là bắt buộc'],{{/if}}
      {{#if unique}}unique: true,{{/if}}
      {{#if default}}default: {{default}},{{/if}}
      {{#if ref}}ref: '{{ref}}',{{/if}}
      {{#if enum}}enum: [{{enum}}],{{/if}}
    },
    {{/each}}
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes
{{#each indexes}}
{{moduleSingular}}Schema.index({{this}});
{{/each}}

module.exports = mongoose.model('{{modelName}}', {{moduleSingular}}Schema);
```

### 3.2. Controller Template
```javascript
// controllers/{{modulePlural}}.controller.js
const {{Model}} = require('../schemas/{{modulePlural}}');

const {{moduleSingular}}Ctrl = {
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const query = { isDeleted: false, ...filters };
      
      const total = await {{Model}}.countDocuments(query);
      const data = await {{Model}}.find(query)
        {{#if populateFields}}.populate('{{populateFields}}'){{/if}}
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const item = await {{Model}}.findOne({ _id: req.params.id, isDeleted: false })
        {{#if populateFields}}.populate('{{populateFields}}'){{/if}};
      if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const item = new {{Model}}(req.body);
      await item.save();
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const item = await {{Model}}.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const item = await {{Model}}.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
      if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
      res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = {{moduleSingular}}Ctrl;
```

### 3.3. Route Template
```javascript
// routes/{{modulePlural}}.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/{{modulePlural}}.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Protected
router.post('/', authMiddleware, {{#if adminOnly}}roleMiddleware('admin'),{{/if}} ctrl.create);
router.put('/:id', authMiddleware, {{#if adminOnly}}roleMiddleware('admin'),{{/if}} ctrl.update);
router.delete('/:id', authMiddleware, {{#if adminOnly}}roleMiddleware('admin'),{{/if}} ctrl.remove);

module.exports = router;
```

## 4. TEMPLATE — FRONTEND

### 4.1. Types Template
```typescript
// types/{{module}}.types.ts
export interface {{ModelName}} {
  _id: string;
  {{#each fields}}
  {{name}}: {{tsType}};
  {{/each}}
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface {{ModelName}}Filter {
  page?: number;
  limit?: number;
  {{#each filterFields}}
  {{name}}?: {{tsType}};
  {{/each}}
}

export interface Create{{ModelName}}Dto {
  {{#each createFields}}
  {{name}}{{#unless required}}?{{/unless}}: {{tsType}};
  {{/each}}
}
```

### 4.2. API Template
```typescript
// api/{{module}}.api.ts
import axiosClient from './axiosClient';
import { {{ModelName}}, {{ModelName}}Filter, Create{{ModelName}}Dto } from '../types/{{module}}.types';
import { ApiResponse } from '../types/api.types';

export const {{module}}Api = {
  getAll: (params: {{ModelName}}Filter) =>
    axiosClient.get<any, ApiResponse<{{ModelName}}[]>>('/{{modulePlural}}', { params }),

  getById: (id: string) =>
    axiosClient.get<any, ApiResponse<{{ModelName}}>>(`/{{modulePlural}}/${id}`),

  create: (data: Create{{ModelName}}Dto) =>
    axiosClient.post<any, ApiResponse<{{ModelName}}>>('/{{modulePlural}}', data),

  update: (id: string, data: Partial<Create{{ModelName}}Dto>) =>
    axiosClient.put<any, ApiResponse<{{ModelName}}>>(`/{{modulePlural}}/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete<any, ApiResponse<null>>(`/{{modulePlural}}/${id}`),
};
```

### 4.3. Hook Template
```typescript
// hooks/use{{ModelName}}.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { {{module}}Api } from '../api/{{module}}.api';
import { {{ModelName}}Filter } from '../types/{{module}}.types';

export const use{{ModelName}}s = (params: {{ModelName}}Filter) => {
  return useQuery({
    queryKey: ['{{modulePlural}}', params],
    queryFn: () => {{module}}Api.getAll(params),
  });
};

export const use{{ModelName}} = (id: string) => {
  return useQuery({
    queryKey: ['{{moduleSingular}}', id],
    queryFn: () => {{module}}Api.getById(id),
    enabled: !!id,
  });
};

export const useCreate{{ModelName}} = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: {{module}}Api.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['{{modulePlural}}'] }),
  });
};

export const useUpdate{{ModelName}} = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {{module}}Api.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['{{modulePlural}}'] }),
  });
};

export const useDelete{{ModelName}} = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: {{module}}Api.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['{{modulePlural}}'] }),
  });
};
```

## 5. CÁCH SỬ DỤNG

Khi user yêu cầu "Tạo module [X]", thực hiện:

1. **Hỏi thông tin** nếu chưa đủ (fields, relations, access level).
2. **Đọc skill tham chiếu**: `nodejs_express_expert`, `mongodb_expert`, `react_typescript_expert`.
3. **Generate Backend files** theo template trên.
4. **Generate Frontend files** theo template trên.
5. **Cập nhật app.js** để register route mới.
6. **Thông báo** cho user danh sách files đã tạo.
