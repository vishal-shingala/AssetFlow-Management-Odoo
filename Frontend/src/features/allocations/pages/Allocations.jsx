import { useState } from 'react';
import { Undo2, RefreshCw, ArrowRightLeft, Plus } from 'lucide-react';

import { allocations, recentAllocations } from '../data/allocations';
import { STATUS_COLORS } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/ui/SearchBar';
import Dropdown from '../../../components/ui/Dropdown';
import StatusBadge from '../../../components/ui/StatusBadge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

const actionColors = {
  Allocated: 'bg-primary/10 text-primary',
  Returned: 'bg-gray-100 text-muted',
  Transferred: 'bg-secondary/10 text-secondary',
};

export default function Allocations() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  const filtered = allocations.filter((a) => {
    const matchesSearch =
      a.asset.toLowerCase().includes(search.toLowerCase()) ||
      a.employee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    { key: 'employee', label: 'Employee' },
    { key: 'department', label: 'Department' },
    { key: 'allocatedDate', label: 'Allocated Date' },
    {
      key: 'returnDate',
      label: 'Return Date',
      render: (val) => val || <span className="text-muted">—</span>,
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
          {row.status === 'Active' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); toast.success('Asset returned'); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-success transition-colors"
                title="Return"
              >
                <Undo2 className="w-6 h-6 flex-shrink-0" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toast.success('Transfer initiated'); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-primary transition-colors"
                title="Transfer"
              >
                <RefreshCw className="w-6 h-6 flex-shrink-0" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Asset Allocation</h1>
          <Breadcrumb items={[{ label: 'Asset Allocation' }]} />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={ArrowRightLeft} iconClassName="w-7 h-7" onClick={() => toast.success('Transfer mode')}>
            Transfer
          </Button>
          <Button icon={Plus} onClick={() => setShowAllocateModal(true)}>
            Allocate Asset
          </Button>
        </div>
      </div>

      <Card hover={false}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search allocations..." />
          </div>
          <div className="w-44">
            <Dropdown
              options={['', 'Active', 'Returned', 'Overdue', 'Transferred']}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            />
          </div>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* Recent Allocations Timeline */}
      <Card hover={false}>
        <h3 className="text-sm font-semibold text-text mb-4">Recent Allocations</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-4">
            {recentAllocations.map((item, i) => (
              <div
                key={item.id}
                className="relative pl-10 fadeinleft animation-duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute left-2.5 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary" />
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColors[item.action] || 'bg-gray-100 text-muted'}`}>
                      {item.action}
                    </span>
                    <span className="text-xs text-muted">{item.date} at {item.time}</span>
                  </div>
                  <p className="text-sm font-medium text-text">{item.asset}</p>
                  <p className="text-xs text-muted">{item.employee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Allocate Modal */}
      <Modal isOpen={showAllocateModal} onClose={() => setShowAllocateModal(false)} title="Allocate Asset">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Asset allocated'); setShowAllocateModal(false); }}>
          <Input label="Asset" placeholder="Search and select asset..." />
          <Input label="Employee" placeholder="Search and select employee..." />
          <Input label="Expected Return Date" type="date" />
          <Input label="Notes" placeholder="Any notes about this allocation..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAllocateModal(false)}>Cancel</Button>
            <Button type="submit">Allocate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
