# 📸 Upload Module

> Module upload hình ảnh lên Cloudinary.

---

## Endpoints

| Method | Endpoint | Access |
|:-------|:---------|:-------|
| POST | `/api/v1/upload` | Admin |
| POST | `/api/v1/upload/multiple` | Admin |

## Config
- **Service**: Cloudinary (free tier)
- **Storage**: Multer memory storage
- **Max size**: 5MB
- **Allowed types**: jpg, jpeg, png, webp
- **Folder**: `luxury-watches/`

## Flow
1. Client gửi file qua multipart/form-data
2. Multer middleware validate type + size
3. Upload buffer lên Cloudinary
4. Return Cloudinary URL + public_id

## Response
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/xxx/image/upload/v123/luxury-watches/abc.jpg",
    "publicId": "luxury-watches/abc"
  }
}
```
