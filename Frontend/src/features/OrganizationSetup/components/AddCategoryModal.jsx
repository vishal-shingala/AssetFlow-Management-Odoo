import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';
import toast from 'react-hot-toast';

export default function AddCategoryModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      description: formData.description || null,
      status: formData.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    };

    try {
      await onSubmit(data);
      toast.success('Category added successfully');
      setFormData({ name: '', description: '', status: 'Active' });
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input 
          label="Category Name" 
          name="name" 
          placeholder="e.g., Laptops" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <Input 
          label="Description" 
          name="description" 
          placeholder="Optional description" 
          value={formData.description}
          onChange={handleChange}
        />
        <Dropdown
          label="Status"
          name="status"
          options={statusOptions}
          value={formData.status}
          onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          placeholder="Select Status"
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="success" type="submit">Save Category</Button>
        </div>
      </form>
    </Modal>
  );
}
