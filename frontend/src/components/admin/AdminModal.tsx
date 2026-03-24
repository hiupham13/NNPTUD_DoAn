import { ReactNode, useEffect } from 'react';
import './AdminModal.css';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

export default function AdminModal({ isOpen, onClose, title, children, size = 'md', footer }: AdminModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal__overlay" onClick={onClose}>
      <div
        className={`admin-modal admin-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button className="admin-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="admin-modal__body">{children}</div>
        {footer && <div className="admin-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
