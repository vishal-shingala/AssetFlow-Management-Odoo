import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';
import toast from 'react-hot-toast';
import { getEmployees, getDepartments } from '../api/organizationApi';

export default function EditDepartmentModal({ isOpen, onClose, onSubmit, department }) {
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    parentDept: '',
  });
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (isOpen && department) {
      setFormData({
        name: department.name || '',
        head: department.department_head_id?.toString() || '',
        parentDept: department.parent_department_id?.toString() || '',
      });
      fetchEmployees();
      fetchDepartments();
    }
  }, [isOpen, department]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await getEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

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
      department_head_id: formData.head ? parseInt(formData.head) : null,
      parent_department_id: formData.parentDept ? parseInt(formData.parentDept) : null,
      status: 'ACTIVE',
    };

    console.log('Submitting department update:', data);
    console.log('Form data:', formData);

    try {
      await onSubmit(data);
      toast.success('Department updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update department';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const employeeOptions = [
    { value: '', label: 'Select Head (Optional)' },
    ...employees.map(emp => ({
      value: emp.id?.toString() || emp.user_id?.toString(),
      label: emp.name
    }))
  ];

  const departmentOptions = [
    { value: '', label: 'Select Parent Department (Optional)' },
    ...departments
      .filter(dept => (dept.id || dept.department_id) !== (department?.id || department?.department_id))
      .map(dept => ({
      value: dept.id?.toString() || dept.department_id?.toString(),
      label: dept.name
    }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Department">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input 
          label="Department Name" 
          name="name" 
          placeholder="e.g., Engineering" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <Dropdown
          label="Head"
          name="head"
          options={employeeOptions}
          value={formData.head}
          onChange={(value) => setFormData(prev => ({ ...prev, head: value }))}
          placeholder="Select Head (Optional)"
          disabled={loadingEmployees}
        />
        <Dropdown
          label="Parent Department"
          name="parentDept"
          options={departmentOptions}
          value={formData.parentDept}
          onChange={(value) => setFormData(prev => ({ ...prev, parentDept: value }))}
          placeholder="Select Parent Department (Optional)"
          disabled={loadingDepartments}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="success" type="submit">Update Department</Button>
        </div>
      </form>
    </Modal>
  );
}
