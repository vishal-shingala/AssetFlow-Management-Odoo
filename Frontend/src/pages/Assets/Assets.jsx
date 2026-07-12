import { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';
import { assets, assetCategories, assetStatuses } from '../../data/assets';
import { STATUS_COLORS } from '../../constants';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Dropdown from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Assets() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const filtered = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || asset.category === categoryFilter;
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
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
      key: 'name',
      label: 'Asset Name',
      render: (val) => <span className="font-medium text-text">{val}</span>,
    },
    { key: 'category', label: 'Category' },
    {
      key: 'serialNumber',
      label: 'Serial Number',
      render: (val) => <span className="font-mono text-xs text-muted">{val}</span>,
    },
    { key: 'location', label: 'Location' },
    {
      key: 'condition',
      label: 'Condition',
      render: (val) => {
        const conditionColors = { Excellent: 'success', Good: 'primary', Fair: 'warning', Poor: 'danger', 'N/A': 'muted' };
        return <StatusBadge status={val} colorKey={conditionColors[val]} size="xs" />;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (val) => val || <span className="text-muted">—</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedAsset(row); setShowViewModal(true); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-primary transition-colors"
          >
            <HiOutlineEye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('Edit asset'); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-warning transition-colors"
          >
            <HiOutlinePencilSquare className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.success('Asset deleted'); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-danger transition-colors"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Assets</h1>
          <Breadcrumb items={[{ label: 'Assets' }]} />
        </div>
        <Button icon={HiOutlinePlus} onClick={() => setShowModal(true)}>
          Add Asset
        </Button>
      </div>

      <Card hover={false}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name, tag, serial..." />
          </div>
          <div className="w-44">
            <Dropdown options={['', ...assetCategories]} value={categoryFilter} onChange={setCategoryFilter} placeholder="Category" />
          </div>
          <div className="w-44">
            <Dropdown options={['', ...assetStatuses]} value={statusFilter} onChange={setStatusFilter} placeholder="Status" />
          </div>
        </div>
        <Table columns={columns} data={filtered} />
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>Showing {filtered.length} of {assets.length} assets</span>
        </div>
      </Card>

      {/* Add Asset Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Asset" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Asset added successfully'); setShowModal(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Asset Name" placeholder={'e.g., MacBook Pro 16"'} />
            <Input label="Asset Tag" placeholder="e.g., AST-013" />
            <Input label="Category" placeholder="e.g., Laptop" />
            <Input label="Serial Number" placeholder="e.g., SN-XXX-2024" />
            <Input label="Location" placeholder="e.g., Building A, Floor 3" />
            <Input label="Condition" placeholder="e.g., Excellent" />
            <Input label="Purchase Date" type="date" />
            <Input label="Warranty Expiry" type="date" />
            <Input label="Value ($)" type="number" placeholder="e.g., 1299.99" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Save Asset</Button>
          </div>
        </form>
      </Modal>

      {/* View Asset Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Asset Details" size="lg">
        {selectedAsset && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm bg-primary/10 text-primary px-3 py-1 rounded-lg font-medium">
                  {selectedAsset.assetTag}
                </span>
              </div>
              <StatusBadge status={selectedAsset.status} colorKey={STATUS_COLORS[selectedAsset.status]} />
            </div>
            <h3 className="text-lg font-semibold">{selectedAsset.name}</h3>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              {[
                ['Category', selectedAsset.category],
                ['Serial Number', selectedAsset.serialNumber],
                ['Location', selectedAsset.location],
                ['Condition', selectedAsset.condition],
                ['Assigned To', selectedAsset.assignedTo || 'Unassigned'],
                ['Purchase Date', selectedAsset.purchaseDate],
                ['Warranty Expiry', selectedAsset.warrantyExpiry],
                ['Value', `$${selectedAsset.value?.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-sm font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
