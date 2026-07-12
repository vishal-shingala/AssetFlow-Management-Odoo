import { Dialog } from 'primereact/dialog';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeMap = {
    sm: '28rem', // max-w-md
    md: '32rem', // max-w-lg
    lg: '42rem', // max-w-2xl
    xl: '56rem', // max-w-4xl
  };

  return (
    <Dialog 
      visible={isOpen} 
      style={{ width: sizeMap[size], maxWidth: '95vw' }} 
      onHide={onClose}
      header={<h2 className="text-lg font-semibold text-text">{title}</h2>}
      className="bg-surface rounded-2xl shadow-2xl"
      contentClassName="px-6 py-4"
      headerClassName="px-6 py-4 border-b border-gray-100"
      maskClassName="bg-black/40 backdrop-blur-sm"
      dismissableMask
    >
      {children}
    </Dialog>
  );
}
