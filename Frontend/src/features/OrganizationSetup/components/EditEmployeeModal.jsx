import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';
import toast from 'react-hot-toast';
import { getDepartments } from '../api/organizationApi';

export default function EditEmployeeModal({ isOpen, onClose, onSubmit, employee }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    status: 'Active',
  });
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department_id?.toString() || '',
        status: employee.status === 'ACTIVE' ? 'Active' : 'Inactive',
      });
      fetchDepartments();
    }
  }, [isOpen, employee]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await getDepartments({ limit: 100 });
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      email: formData.email,
      department_id: formData.department ? parseInt(formData.department) : null,
      status: formData.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    };

    try {
      await onSubmit(data);
      toast.success('Employee updated successfully');
    } catch (error) {
      toast.error('Failed to update employee');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const departmentOptions = [
    { value: '', label: 'Select Department (Optional)' },
    ...departments.map(dept => ({
      value: dept.id.toString(),
      label: dept.name
    }))
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input 
          label="Full Name" 
          name="name" 
          placeholder="e.g., John Doe" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <Input 
          label="Email" 
          name="email" 
          type="email"
          placeholder="e.g., john@example.com" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <Dropdown
          label="Department"
          name="department"
          options={departmentOptions}
          value={formData.department}
          onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
          placeholder="Select Department (Optional)"
          disabled={loadingDepartments}
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
          <Button variant="success" type="submit">Update Employee</Button>
        </div>
      </form>
    </Modal>
  );
}
