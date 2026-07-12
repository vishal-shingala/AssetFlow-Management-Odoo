import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

export default function AddDepartmentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    parentDept: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      head: formData.head || '--',
      parentDept: formData.parentDept || '--',
      status: 'ACTIVE',
    };

    try {
      await onSubmit(data);
      toast.success('Department added successfully');
      setFormData({ name: '', head: '', parentDept: '' });
    } catch (error) {
      toast.error('Failed to add department');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Department">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input 
          label="Department Name" 
          name="name" 
          placeholder="e.g., Engineering" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <Input 
          label="Head" 
          name="head" 
          placeholder="e.g., Aditi Rao" 
          value={formData.head}
          onChange={handleChange}
        />
        <Input 
          label="Parent Department" 
          name="parentDept" 
          placeholder="e.g., Field Ops (optional)" 
          value={formData.parentDept}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Department</Button>
        </div>
      </form>
    </Modal>
  );
}
