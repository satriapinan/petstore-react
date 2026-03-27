import Button from '@/shared/components/button/button.component';
import { Icon } from '@iconify/react';
import React, { useEffect, useRef } from 'react';
import './confirm-modal.component.css';

interface ConfirmModalProps {
  isOpen?: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  icon?: string;
  type?: 'primary' | 'danger' | 'warning' | 'success';
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen = false,
  title = 'Are you sure?',
  message = 'This action cannot be undone. All values associated with this field will be lost.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  icon = 'mdi:alert-outline',
  type = 'danger',
  onConfirm,
  onCancel,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel?.();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      role="none"
      onClick={(e) => e.target === backdropRef.current && onCancel?.()}
      onKeyDown={(e) => e.key === 'Escape' && onCancel?.()}
    >
      <div className="modal-content">
        <div className={`modal-icon ${type}`}>
          <Icon icon={icon} />
        </div>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <Button
            label={confirmLabel}
            variant="contained"
            color={type}
            fullWidth
            loading={loading}
            disabled={loading}
            onClick={() => !loading && onConfirm?.()}
          />
          <Button
            label={cancelLabel}
            variant="outline"
            color="primary"
            fullWidth
            disabled={loading}
            onClick={() => !loading && onCancel?.()}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
