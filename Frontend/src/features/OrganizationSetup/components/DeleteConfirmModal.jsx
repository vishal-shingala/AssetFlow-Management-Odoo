import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, itemType }) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success(`${itemType} deleted successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <Trash2 className="w-6 h-6" />
          <p className="font-medium">Are you sure you want to delete this {itemType}?</p>
        </div>
        {itemName && (
          <p className="text-text/70">
            <span className="font-medium">{itemName}</span> will be permanently deleted.
          </p>
        )}
        <p className="text-sm text-text/50">This action cannot be undone.</p>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}
