import { useRef, useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { productAdminService } from '../../services/productAdminService';
import toast from 'react-hot-toast';
import './ImageUploader.css';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = maxImages - images.length;
    if (files.length > remaining) {
      toast.error(`Chỉ được thêm tối đa ${remaining} ảnh nữa`);
      return;
    }

    setUploading(true);
    try {
      const urls = await productAdminService.uploadImages(files);
      onChange([...images, ...urls]);
    } catch {
      toast.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="img-uploader">
      <div className="img-uploader__grid">
        {images.map((url, idx) => (
          <div key={idx} className="img-uploader__item">
            <img src={url} alt={`Ảnh ${idx + 1}`} />
            <button type="button" className="img-uploader__remove" onClick={() => handleRemove(idx)}>
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            className="img-uploader__add"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader size={20} className="img-uploader__spin" /> : <Upload size={20} />}
            <span>{uploading ? 'Đang tải...' : 'Thêm ảnh'}</span>
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFileChange}
      />
      <p className="img-uploader__hint">Tối đa {maxImages} ảnh. Định dạng JPG, PNG, WebP.</p>
    </div>
  );
}
