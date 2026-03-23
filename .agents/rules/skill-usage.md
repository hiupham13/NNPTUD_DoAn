---
description: Quy tắc khi sử dụng skills — LUÔN đọc SKILL.md trước khi thực hiện công việc liên quan.
globs: ["**/*"]
alwaysApply: true
---

# 🎯 QUY TẮC SỬ DỤNG SKILLS

## 1. BẮT BUỘC ĐỌC SKILL TRƯỚC KHI LÀM

Khi nhận yêu cầu, **PHẢI** kiểm tra yêu cầu liên quan đến skill nào và đọc SKILL.md tương ứng.

## 2. MA TRẬN YÊU CẦU → SKILL

| Yêu cầu của User | Skills PHẢI đọc |
|:-----------------|:----------------|
| _"Tạo module [X]"_ / _"Thêm CRUD cho [X]"_ | `fullstack_module_generator` → `nodejs_express_expert` → `react_typescript_expert` → `mongodb_expert` |
| _"Thiết kế database"_ / _"Tạo schema"_ | `mongodb_expert` |
| _"Code API [X]"_ / _"Viết route [X]"_ | `nodejs_express_expert` |
| _"Code giao diện [X]"_ / _"Tạo page [X]"_ | `react_typescript_expert` → `ui_ux_designer` |
| _"Thiết kế màn hình"_ / _"Design [X]"_ | `ui_ux_designer` |
| _"Setup Docker"_ / _"Cấu hình deploy"_ | `docker_devops` → `system_architect` |
| _"Phân tích nghiệp vụ [X]"_ | `business_analyst` |
| _"Lên kế hoạch"_ / _"Sprint planning"_ | `project_manager` |
| _"Tích hợp thanh toán"_ / _"Payment"_ | `payment_integration` |
| _"Viết test"_ / _"Test API"_ | `api_testing_qa` |
| _"Review bảo mật"_ / _"Tối ưu"_ | `security_performance` |
| _"Kiến trúc"_ / _"Cấu trúc thư mục"_ | `system_architect` |

## 3. ĐƯỜNG DẪN SKILLS

```
.agent/skills/
├── project_manager/SKILL.md
├── business_analyst/SKILL.md
├── system_architect/SKILL.md
├── nodejs_express_expert/SKILL.md
├── mongodb_expert/SKILL.md
├── react_typescript_expert/SKILL.md
├── fullstack_module_generator/SKILL.md
├── docker_devops/SKILL.md
├── api_testing_qa/SKILL.md
├── ui_ux_designer/SKILL.md
├── payment_integration/SKILL.md
└── security_performance/SKILL.md
```

## 4. QUY TẮC KẾT HỢP SKILLS

- Có thể đọc **nhiều skills** nếu task liên quan đến nhiều layer.
- Khi có conflict giữa skills → Ưu tiên skill chuyên sâu hơn cho task đó.
- Ví dụ: Tạo module mới → `fullstack_module_generator` cho template, nhưng `nodejs_express_expert` cho best practices chi tiết.
