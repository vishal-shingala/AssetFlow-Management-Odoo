import { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { STATUS_COLORS } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/ui/SearchBar';
import Dropdown from '../../../components/ui/Dropdown';
import StatusBadge from '../../../components/ui/StatusBadge';
import Pagination from '../../../components/ui/Pagination';
import OrganizationTabs from '../components/OrganizationTabs';
import AddDepartmentModal from '../components/AddDepartmentModal';
import AddCategoryModal from '../components/AddCategoryModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditDepartmentModal from '../components/EditDepartmentModal';
import EditCategoryModal from '../components/EditCategoryModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/organizationApi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employeeApi';
import { departments } from '../data/departments';

const TABS = ['Departments', 'Categories', 'Employee'];

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('Departments');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Departments state
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [deptPagination, setDeptPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Categories state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryPagination, setCategoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Employees state
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeePagination, setEmployeePagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (activeTab === 'Departments') {
      fetchDepartments();
    } else if (activeTab === 'Categories') {
      fetchCategories();
    } else if (activeTab === 'Employee') {
      fetchEmployees();
    }
  }, [activeTab, deptPagination.page, deptPagination.limit, categoryPagination.page, categoryPagination.limit, employeePagination.page, employeePagination.limit, search, statusFilter]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const params = {
        page: deptPagination.page,
        limit: deptPagination.limit,
        sortBy: 'department_id',
        sortOrder: 'asc'
      };
      
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter === 'Active' ? 'ACTIVE' : 'INACTIVE';
      
      const response = await getDepartments(params);
      setDepartments(response.data || []);
      if (response.pagination) {
        setDeptPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      if (import.meta.env.DEV) {
        setDepartments(departments);
      } else {
        setDepartments([]);
      }
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const params = {
        page: categoryPagination.page,
        limit: categoryPagination.limit,
        sortBy: 'category_id',
        sortOrder: 'asc'
      };
      
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter === 'Active' ? 'ACTIVE' : 'INACTIVE';
      
      const response = await getCategories(params);
      setCategories(response.data || []);
      if (response.pagination) {
        setCategoryPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const params = {
        page: employeePagination.page,
        limit: employeePagination.limit,
        sortBy: 'user_id',
        sortOrder: 'asc'
      };
      
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter === 'Active' ? 'ACTIVE' : 'INACTIVE';
      
      const response = await getEmployees(params);
      setEmployees(response.data || []);
      if (response.pagination) {
        setEmployeePagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearch('');
    setStatusFilter('');
    setShowModal(false);
    setEditItem(null);
    setDeleteItem(null);
    setShowDeleteModal(false);
  }, []);

  const handleAddDepartment = async (data) => {
    try {
      await createDepartment(data);
      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
      throw error;
    }
  };

  const handleEditDepartment = async (data) => {
    try {
      const deptId = editItem.department_id || editItem.id;
      console.log('Updating department with ID:', deptId, 'from editItem:', editItem);
      await updateDepartment(deptId, data);
      setShowModal(false);
      setEditItem(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      throw new Error('Failed to update department: ' + errorMessage);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      const deptId = deleteItem.department_id || deleteItem.id;
      console.log('Deleting department with ID:', deptId, 'from deleteItem:', deleteItem);
      await deleteDepartment(deptId);
      setShowDeleteModal(false);
      setDeleteItem(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || error.toString();
      throw new Error(errorMessage);
    }
  };

  const handleAddCategory = async (data) => {
    try {
      await createCategory(data);
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const handleEditCategory = async (data) => {
    try {
      await updateCategory(editItem.id, data);
      setShowModal(false);
      setEditItem(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      throw new Error('Failed to update category: ' + errorMessage);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(deleteItem.id);
      setShowDeleteModal(false);
      setDeleteItem(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      if (errorMessage.includes('foreign key constraint') || 
          errorMessage.includes('violates foreign key constraint')) {
        throw new Error('Cannot delete category: It is referenced by assets or other records.');
      }
      throw new Error('Failed to delete category: ' + errorMessage);
    }
  };

  const handleAddEmployee = async (data) => {
    try {
      await createEmployee(data);
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  };

  const handleEditEmployee = async (data) => {
    try {
      await updateEmployee(editItem.id, data);
      setShowModal(false);
      setEditItem(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      throw new Error('Failed to update employee: ' + errorMessage);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(deleteItem.id);
      setShowDeleteModal(false);
      setDeleteItem(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      if (errorMessage.includes('foreign key constraint') || 
          errorMessage.includes('violates foreign key constraint')) {
        throw new Error('Cannot delete employee: They have assigned assets or allocations.');
      }
      throw new Error('Failed to delete employee: ' + errorMessage);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  const handleDeptPageChange = (newPage) => {
    setDeptPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCategoryPageChange = (newPage) => {
    setCategoryPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEmployeePageChange = (newPage) => {
    setEmployeePagination(prev => ({ ...prev, page: newPage }));
  };

  const departmentColumns = useMemo(() => [
    {
      key: 'serial',
      label: '#',
      render: (_, row, idx) => (
        <span className="text-text/70 font-medium">
          {(deptPagination.page - 1) * deptPagination.limit + idx + 1}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Department',
      render: (val) => <span className="font-medium text-text">{val}</span>,
    },
    { key: 'head', label: 'Head' },
    { key: 'parentDept', label: 'Parent Dept' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            onClick={() => handleEditClick(row)}
          />
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      ),
    },
  ], [deptPagination.page, deptPagination.limit]);

  const categoryColumns = useMemo(() => [
    {
      key: 'serial',
      label: '#',
      render: (_, row, idx) => (
        <span className="text-text/70 font-medium">
          {(categoryPagination.page - 1) * categoryPagination.limit + idx + 1}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Category',
      render: (val) => <span className="font-medium text-text">{val}</span>,
    },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            onClick={() => handleEditClick(row)}
          />
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      ),
    },
  ], [categoryPagination.page, categoryPagination.limit]);

  const employeeColumns = useMemo(() => [
    {
      key: 'serial',
      label: '#',
      render: (_, row, idx) => (
        <span className="text-text/70 font-medium">
          {(employeePagination.page - 1) * employeePagination.limit + idx + 1}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (val) => <span className="font-medium text-text">{val}</span>,
    },
    { key: 'email', label: 'Email' },
    {
      key: 'department',
      label: 'Department',
      render: (val, row) => {
        if (typeof val === 'object' && val !== null) {
          return val.name || '--';
        }
        return val || '--';
      },
    },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            onClick={() => handleEditClick(row)}
          />
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      ),
    },
  ], [employeePagination.page, employeePagination.limit]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Organization Setup</h1>
          {/* <Breadcrumb items={[{ label: 'Organization Setup' }]} /> */}
        </div>
        {activeTab !== 'Employee' && (
          <Button variant="success" icon={Plus} onClick={() => {
            setEditItem(null);
            setShowModal(true);
          }}>
            Add
          </Button>
        )}
      </div>

      <OrganizationTabs 
        tabs={TABS} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {activeTab === 'Departments' && (
        <Card hover={false}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Search departments..." />
            </div>
            <div className="w-48">
              <Dropdown
                options={['', 'Active', 'Inactive']}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
              />
            </div>
          </div>
          <Table columns={departmentColumns} data={departments} loading={loadingDepartments} />
          {deptPagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={deptPagination.page}
                totalPages={deptPagination.totalPages}
                onPageChange={handleDeptPageChange}
              />
            </div>
          )}
        </Card>
      )}

      {activeTab === 'Categories' && (
        <Card hover={false}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
            </div>
            <div className="w-48">
              <Dropdown
                options={['', 'Active', 'Inactive']}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
              />
            </div>
          </div>
          <Table columns={categoryColumns} data={categories} loading={loadingCategories} />
          {categoryPagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={categoryPagination.page}
                totalPages={categoryPagination.totalPages}
                onPageChange={handleCategoryPageChange}
              />
            </div>
          )}
        </Card>
      )}

      {activeTab === 'Employee' && (
        <Card hover={false}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
            </div>
            <div className="w-48">
              <Dropdown
                options={['', 'Active', 'Inactive']}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
              />
            </div>
          </div>
          <Table columns={employeeColumns} data={employees} loading={loadingEmployees} />
          {employeePagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={employeePagination.page}
                totalPages={employeePagination.totalPages}
                onPageChange={handleEmployeePageChange}
              />
            </div>
          )}
        </Card>
      )}

      {activeTab === 'Departments' && !editItem && (
        <AddDepartmentModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleAddDepartment} 
        />
      )}
      {activeTab === 'Departments' && editItem && (
        <EditDepartmentModal 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }} 
          onSubmit={handleEditDepartment}
          department={editItem}
        />
      )}
      {activeTab === 'Categories' && !editItem && (
        <AddCategoryModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleAddCategory} 
        />
      )}
      {activeTab === 'Categories' && editItem && (
        <EditCategoryModal 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }} 
          onSubmit={handleEditCategory}
          category={editItem}
        />
      )}
      {activeTab === 'Employee' && !editItem && (
        <AddEmployeeModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleAddEmployee} 
        />
      )}
      {activeTab === 'Employee' && editItem && (
        <EditEmployeeModal 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }} 
          onSubmit={handleEditEmployee}
          employee={editItem}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteItem(null);
        }}
        onConfirm={() => {
          if (activeTab === 'Departments') {
            handleDeleteDepartment();
          } else if (activeTab === 'Categories') {
            handleDeleteCategory();
          } else if (activeTab === 'Employee') {
            handleDeleteEmployee();
          }
        }}
        itemName={deleteItem?.name || deleteItem?.email || ''}
        itemType={activeTab === 'Employee' ? 'employee' : activeTab.slice(0, -1)}
      />
    </div>
  );
}
