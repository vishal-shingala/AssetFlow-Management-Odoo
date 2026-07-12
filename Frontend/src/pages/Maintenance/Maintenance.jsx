import { useState } from 'react';
import { motion } from 'framer-motion';

import { maintenanceRequests, maintenanceStats } from '../../data/maintenance';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Dropdown from '../../components/ui/Dropdown';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const statusCards = [
  {
    key: 'pending',
    label: 'Pending',
    icon: HiOutlineClock,
    color: 'text-warning',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    key: 'approved',
    label: 'Approved',
    icon: HiOutlineCheckCircle,
    color: 'text-secondary',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: HiOutlineWrenchScrewdriver,
    color: 'text-primary',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    icon: HiOutlineCheckCircle,
    color: 'text-success',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
];

export default function Maintenance() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const filtered = maintenanceRequests.filter((m) => {
    const matchesSearch =
      m.asset.toLowerCase().includes(search.toLowerCase()) ||
      m.issue.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || m.status === statusFilter;
    const matchesPriority = !priorityFilter || m.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns = [
    {
      key: 'assetTag',
      label: 'Asset Tag',
      render: (val) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md font-medium text-primary">{val}</span>
      ),
    },
    {
      key: 'asset',
      label: 'Asset',
      render: (val) => <span className="font-medium text-text">{val}</span>,
    },
    {
      key: 'issue',
      label: 'Issue',
      render: (val) => <span className="max-w-[200px] truncate block">{val}</span>,
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <StatusBadge status={val} colorKey={PRIORITY_COLORS[val]} />,
    },
    { key: 'assignedTo', label: 'Assigned To' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'reportedDate',
      label: 'Reported',
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedItem(row); setShowTimeline(true); }}
          className="text-xs text-primary hover:text-indigo-700 font-medium transition-colors"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Maintenance</h1>
          <Breadcrumb items={[{ label: 'Maintenance' }]} />
        </div>
        <Button icon={HiOutlinePlus} onClick={() => setShowModal(true)}>
          New Request
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`border-l-4 ${card.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted uppercase">{card.label}</p>
                    <p className="text-3xl font-bold text-text mt-1">{maintenanceStats[card.key]}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Maintenance Table */}
      <Card hover={false}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search maintenance requests..." />
          </div>
          <div className="w-40">
            <Dropdown
              options={['', 'Pending', 'Approved', 'In Progress', 'Resolved']}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            />
          </div>
          <div className="w-36">
            <Dropdown
              options={['', 'Critical', 'High', 'Medium', 'Low']}
              value={priorityFilter}
              onChange={setPriorityFilter}
              placeholder="Priority"
            />
          </div>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* New Request Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Maintenance Request">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Request submitted'); setShowModal(false); }}>
          <Input label="Asset" placeholder="Select asset..." />
          <Input label="Issue Description" placeholder="Describe the issue..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Priority" placeholder="Select priority..." />
            <Input label="Expected Completion" type="date" />
          </div>
          <Input label="Notes" placeholder="Additional notes..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>

      {/* Timeline Modal */}
      <Modal isOpen={showTimeline} onClose={() => setShowTimeline(false)} title="Maintenance Timeline" size="md">
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text">{selectedItem.asset}</h3>
                <p className="text-sm text-muted">{selectedItem.issue}</p>
              </div>
              <StatusBadge status={selectedItem.priority} colorKey={PRIORITY_COLORS[selectedItem.priority]} />
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div>
                <p className="text-xs text-muted">Reported By</p>
                <p className="text-sm font-medium">{selectedItem.reportedBy}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Assigned To</p>
                <p className="text-sm font-medium">{selectedItem.assignedTo}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Reported Date</p>
                <p className="text-sm font-medium">{selectedItem.reportedDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Expected Completion</p>
                <p className="text-sm font-medium">{selectedItem.expectedCompletion}</p>
              </div>
            </div>

            {/* Simple Timeline */}
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
              {[
                { status: 'Reported', date: selectedItem.reportedDate, done: true },
                { status: 'Approved', date: selectedItem.status !== 'Pending' ? selectedItem.reportedDate : null, done: selectedItem.status !== 'Pending' },
                { status: 'In Progress', date: selectedItem.status === 'In Progress' || selectedItem.status === 'Resolved' ? 'In progress' : null, done: selectedItem.status === 'In Progress' || selectedItem.status === 'Resolved' },
                { status: 'Resolved', date: selectedItem.resolvedDate || null, done: selectedItem.status === 'Resolved' },
              ].map((step, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
                    step.done ? 'bg-success border-success' : 'bg-white border-gray-300'
                  }`} />
                  <div className="ml-2">
                    <p className={`text-sm font-medium ${step.done ? 'text-text' : 'text-muted'}`}>
                      {step.status}
                    </p>
                    {step.date && <p className="text-xs text-muted">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>

            {selectedItem.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-muted mb-1">Notes</p>
                <p className="text-sm">{selectedItem.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
