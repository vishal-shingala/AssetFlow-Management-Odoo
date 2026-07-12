import { useState } from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import { employees } from '../data/employees';
import { STATUS_COLORS } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/ui/SearchBar';
import Dropdown from '../../../components/ui/Dropdown';
import Modal from '../../../components/ui/Modal';
import StatusBadge from '../../../components/ui/StatusBadge';
import Avatar from '../../../components/ui/Avatar';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Employees() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const uniqueDepts = [...new Set(employees.map((e) => e.department))];

  const filtered = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !deptFilter || emp.department === deptFilter;
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} size="sm" />
          <div>
            <p className="font-medium text-name-text text-sm">{val}</p>
            <p className="text-xs text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'assetsAssigned',
      label: 'Assets',
      render: (val) => (
        <span className="inline-flex items-center justify-center p-1.5 aspect-square rounded-full bg-tag-bg text-tag-text text-xs font-semibold">
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedEmployee(row); setShowProfile(true); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-primary transition-colors"
            title="View details"
          >
            <Eye className="w-6 h-6 flex-shrink-0" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('Edit employee'); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-warning transition-colors"
            title="Edit employee"
          >
            <Edit2 className="w-6 h-6 flex-shrink-0" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('Employee removed'); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-danger transition-colors"
            title="Delete employee"
          >
            <Trash2 className="w-6 h-6 flex-shrink-0" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Employees</h1>
          <Breadcrumb items={[{ label: 'Employees' }]} />
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Employee
        </Button>
      </div>

      <Card hover={false}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
          </div>
          <div className="flex-1 md:flex-none md:w-1/4">
            <Dropdown options={['', ...uniqueDepts]} value={deptFilter} onChange={setDeptFilter} placeholder="Department" />
          </div>
          <div className="flex-1 md:flex-none md:w-1/4">
            <Dropdown options={['', 'Active', 'On Leave', 'Inactive']} value={statusFilter} onChange={setStatusFilter} placeholder="Status" />
          </div>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* Add Employee Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Employee">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Employee added'); setShowModal(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Email" type="email" placeholder="john@company.com" />
            <Input label="Phone" placeholder="+1 (555) 000-0000" />
            <Input label="Department" placeholder="Engineering" />
            <Input label="Role" placeholder="Senior Developer" />
            <Input label="Join Date" type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Save Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Employee Profile Modal */}
      <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} title="Employee Profile" size="md">
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedEmployee.name} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-name-text">{selectedEmployee.name}</h3>
                <p className="text-sm text-muted">{selectedEmployee.role}</p>
                <StatusBadge status={selectedEmployee.status} colorKey={STATUS_COLORS[selectedEmployee.status]} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted">Email</p>
                <p className="text-sm font-medium">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Phone</p>
                <p className="text-sm font-medium">{selectedEmployee.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Department</p>
                <p className="text-sm font-medium">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Join Date</p>
                <p className="text-sm font-medium">{selectedEmployee.joinDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Assets Assigned</p>
                <p className="text-sm font-medium">{selectedEmployee.assetsAssigned}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
