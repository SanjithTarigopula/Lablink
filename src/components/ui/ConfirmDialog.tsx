import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={`w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0 ${
            variant === 'danger'
              ? 'bg-[#2c1314] text-[#f87171] border border-[#441a1d]'
              : 'bg-[#221b0c] text-[#f0c45a] border border-[#3d3015]'
          }`}
        >
          <AlertCircle className="w-4.5 h-4.5" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#faf8f9] mb-1">{title}</h4>
          <p className="text-xs text-[#8e8e8c] leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
