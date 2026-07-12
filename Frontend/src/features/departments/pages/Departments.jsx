import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';
import { departments } from '../data/departments';
import { STATUS_COLORS } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/ui/SearchBar';
import Dropdown from '../../../components/ui/Dropdown';
import Modal from '../../../components/ui/Modal';
import StatusBadge from '../../../components/ui/StatusBadge';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Departments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const filtered = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.head.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      label: 'Department',
      render: (val) => <span className="font-medium text-text">{val}</span>,
    },
    { key: 'head', label: 'Department Head' },
    {
      key: 'employees',
      label: 'Employees',
      render: (val) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedDept(row); setShowViewModal(true); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-primary transition-colors"
          >
            <i className="pi pi-eye w-4 h-4"></i>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('Edit department'); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-warning transition-colors"
          >
            <i className="pi pi-pencil w-4 h-4"></i>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('Department deleted'); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-danger transition-colors"
          >
            <i className="pi pi-trash w-4 h-4"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Departments</h1>
          <Breadcrumb items={[{ label: 'Departments' }]} />
        </div>
        <Button icon={HiOutlinePlus} onClick={() => setShowModal(true)}>
          Add Department
        </Button>
      </div>

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
        <Table columns={columns} data={filtered} />
      </Card>

      {/* Add Department Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Department">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Department added'); setShowModal(false); }}>
          <Input label="Department Name" placeholder="e.g., Engineering" />
          <Input label="Department Head" placeholder="e.g., John Doe" />
          <Input label="Location" placeholder="e.g., Building A, Floor 3" />
          <Input label="Description" placeholder="Brief description" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Save Department</Button>
          </div>
        </form>
      </Modal>

      {/* View Department Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Department Details" size="md">
        {selectedDept && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted">Department</p>
                <p className="text-sm font-medium">{selectedDept.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Head</p>
                <p className="text-sm font-medium">{selectedDept.head}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Employees</p>
                <p className="text-sm font-medium">{selectedDept.employees}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Status</p>
                <StatusBadge status={selectedDept.status} colorKey={STATUS_COLORS[selectedDept.status]} />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="text-sm font-medium">{selectedDept.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Budget</p>
                <p className="text-sm font-medium">${selectedDept.budget?.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted">Description</p>
              <p className="text-sm">{selectedDept.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
