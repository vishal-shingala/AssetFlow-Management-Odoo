import { useState, useEffect, useCallback } from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import assetService from '../api/assetService';
import { assetCategories, assetStatuses } from '../data/assets';
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
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { usePermission } from '../../../hooks/usePermission';

export default function Assets() {
  const { can } = usePermission();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form inputs for Add/Edit Asset
  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    category: 'Laptop',
    serialNumber: '',
    location: '',
    condition: 'Excellent',
    purchaseDate: '',
    warrantyExpiry: '',
    value: '',
  });

  const validateAssetForm = () => {
    const errors = {};

    // 1. Asset Name
    if (!formData.name || typeof formData.name !== 'string' || formData.name.trim().length < 2) {
      errors.name = 'Asset Name is required (at least 2 characters)';
    } else if (!/[a-zA-Z]/.test(formData.name)) {
      errors.name = 'Asset Name must contain letters';
    }

    // 2. Asset Tag (Required & must start with AST-)
    if (!formData.assetTag || formData.assetTag.trim() === '') {
      errors.assetTag = 'Asset Tag is required';
    } else if (!formData.assetTag.trim().toUpperCase().startsWith('AST-')) {
      errors.assetTag = 'Asset Tag must start with "AST-" (e.g., AST-001)';
    } else if (!/^AST-[A-Za-z0-9-_]+$/i.test(formData.assetTag.trim())) {
      errors.assetTag = 'Asset Tag must follow format AST-XXXX with letters, numbers, or dashes';
    }

    // 3. Serial Number (Required & must start with SN)
    if (!formData.serialNumber || formData.serialNumber.trim() === '') {
      errors.serialNumber = 'Serial Number is required';
    } else if (!formData.serialNumber.trim().toUpperCase().startsWith('SN')) {
      errors.serialNumber = 'Serial Number must start with "SN" (e.g., SN-2024-001)';
    }

    // 4. Location (Required)
    if (!formData.location || typeof formData.location !== 'string' || formData.location.trim().length < 2) {
      errors.location = 'Location is required (at least 2 characters)';
    } else if (!/[a-zA-Z]/.test(formData.location)) {
      errors.location = 'Location must contain letters';
    }

    // 5. Purchase Date (Required)
    if (!formData.purchaseDate) {
      errors.purchaseDate = 'Purchase Date is required';
    }

    // 6. Warranty Expiry (Required & >= purchaseDate)
    if (!formData.warrantyExpiry) {
      errors.warrantyExpiry = 'Warranty Expiry date is required';
    } else if (formData.purchaseDate && new Date(formData.warrantyExpiry) < new Date(formData.purchaseDate)) {
      errors.warrantyExpiry = 'Warranty expiry cannot be before purchase date';
    }

    // 7. Value ($) (Required & numerical positive)
    if (formData.value === '' || formData.value === null || formData.value === undefined) {
      errors.value = 'Value ($) is required';
    } else {
      const valStr = String(formData.value).trim();
      if (!/^\d+(\.\d+)?$/.test(valStr)) {
        errors.value = 'Value ($) must contain only positive numbers (e.g., 1299.99)';
      }
    }

    // Check duplicate Asset Tag
    if (!errors.assetTag && formData.assetTag) {
      const duplicateTag = assets.find(
        (a) =>
          (a.assetTag || '').toLowerCase() === formData.assetTag.trim().toLowerCase() &&
          (!editingAsset || a.id !== editingAsset.id)
      );
      if (duplicateTag) {
        errors.assetTag = `An asset with tag "${formData.assetTag.trim()}" already exists`;
      }
    }

    // Check duplicate Serial Number
    if (!errors.serialNumber && formData.serialNumber) {
      const duplicateSerial = assets.find(
        (a) =>
          (a.serialNumber || '').toLowerCase() === formData.serialNumber.trim().toLowerCase() &&
          (!editingAsset || a.id !== editingAsset.id)
      );
      if (duplicateSerial) {
        errors.serialNumber = `An asset with serial number "${formData.serialNumber.trim()}" already exists`;
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await assetService.getAll();
      setAssets(data);
    } catch (error) {
      toast.error('Failed to load assets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await assetService.delete(id);
      await fetchAssets();
      toast.success('Asset deleted successfully');
    } catch (error) {
      toast.error('Failed to delete asset');
      console.error(error);
    }
  };

  const formatDateForInput = (val) => {
    if (!val) return '';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val).split('T')[0];
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      assetTag: '',
      category: 'Laptop',
      serialNumber: '',
      location: '',
      condition: 'Excellent',
      purchaseDate: '',
      warrantyExpiry: '',
      value: '',
    });
    setFormErrors({});
  };

  const handleOpenEditModal = (e, row) => {
    e.stopPropagation();
    setFormErrors({});
    setEditingAsset(row);
    setFormData({
      name: row.name || '',
      assetTag: row.assetTag || '',
      category: row.category || 'Laptop',
      serialNumber: row.serialNumber || '',
      location: row.location || '',
      condition: row.condition || 'Excellent',
      purchaseDate: formatDateForInput(row.purchaseDate),
      warrantyExpiry: formatDateForInput(row.warrantyExpiry),
      value: row.value !== undefined && row.value !== null ? String(row.value) : '',
    });
    setShowEditModal(true);
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    if (!validateAssetForm()) return;
    try {
      await assetService.update(editingAsset.id, formData);
      await fetchAssets();
      toast.success('Asset updated successfully');
      setShowEditModal(false);
      setEditingAsset(null);
      resetForm();
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error?.message || '';
      if (serverMsg.toLowerCase().includes('duplicate') || serverMsg.toLowerCase().includes('unique')) {
        toast.error('An asset with this Tag or Serial Number already exists');
      } else {
        toast.error(serverMsg || 'Failed to update asset');
      }
      console.error(error);
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!validateAssetForm()) return;
    try {
      await assetService.create(formData);
      await fetchAssets();
      toast.success('Asset added successfully');
      setShowModal(false);
      resetForm();
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error?.message || '';
      if (serverMsg.toLowerCase().includes('duplicate') || serverMsg.toLowerCase().includes('unique')) {
        toast.error('An asset with this Tag or Serial Number already exists');
      } else {
        toast.error(serverMsg || 'Failed to add asset');
      }
      console.error(error);
    }
  };

  const filtered = assets.filter((asset) => {
    const q = (search || '').trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(asset.name || asset.asset_name || '').toLowerCase().includes(q) ||
      String(asset.assetTag || asset.asset_tag || '').toLowerCase().includes(q) ||
      String(asset.serialNumber || asset.serial_number || '').toLowerCase().includes(q);
    const matchesCategory =
      !categoryFilter || (asset.category || '').toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus =
      !statusFilter || (asset.status || '').toLowerCase() === statusFilter.toLowerCase();
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
        return <StatusBadge status={val} colorKey={conditionColors[val] || 'primary'} size="xs" />;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val] || 'primary'} />,
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
        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-primary transition-colors" title="View details" onClick={(e) => { e.stopPropagation(); setSelectedAsset(row); setShowViewModal(true); }}>
            <Eye className="w-5 h-5 flex-shrink-0" />
          </button>
          {can(['ASSET_MANAGER', 'ADMIN']) && (
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-primary transition-colors" title="Edit asset" onClick={(e) => handleOpenEditModal(e, row)}>
              <Edit2 className="w-5 h-5 flex-shrink-0" />
            </button>
          )}
          {can(['ASSET_MANAGER', 'ADMIN']) && (
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-muted hover:text-danger transition-colors" title="Delete asset" onClick={(e) => handleDelete(e, row.id)}>
              <Trash2 className="w-5 h-5 flex-shrink-0" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Assets</h1>
          {/* <Breadcrumb items={[{ label: 'Assets' }]} /> */}
        </div>
        <div className="flex gap-3">
          {can(['ASSET_MANAGER', 'ADMIN']) && (
            <Button icon={Plus} onClick={() => { resetForm(); setShowModal(true); }}>
              Add Asset
            </Button>
          )}
        </div>
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

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table columns={columns} data={filtered} />
            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span>Showing {filtered.length} of {assets.length} assets</span>
            </div>
          </>
        )}
      </Card>

      {/* Add Asset Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Add New Asset" size="lg">
        <form className="space-y-4" onSubmit={handleCreateAsset}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Asset Name"
              placeholder={'e.g., MacBook Pro 16"'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <Input
              label="Asset Tag"
              placeholder="e.g., AST-013"
              value={formData.assetTag}
              onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
              error={formErrors.assetTag}
            />
            <Dropdown
              label="Category"
              options={assetCategories}
              value={formData.category || 'Laptop'}
              onChange={(val) => setFormData({ ...formData, category: val })}
              placeholder="Select Category"
            />
            <Input
              label="Serial Number"
              placeholder="e.g., SN-XXX-2024"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              error={formErrors.serialNumber}
            />
            <Input
              label="Location"
              placeholder="e.g., Building A, Floor 3"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
            />
            <Dropdown
              label="Condition"
              options={['Excellent', 'Good', 'Fair', 'Poor']}
              value={formData.condition || 'Excellent'}
              onChange={(val) => setFormData({ ...formData, condition: val })}
              placeholder="Select Condition"
            />
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              error={formErrors.purchaseDate}
            />
            <Input
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              error={formErrors.warrantyExpiry}
            />
            <Input
              label="Value ($)"
              type="number"
              placeholder="e.g., 1299.99"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              error={formErrors.value}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button type="submit">Save Asset</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Asset Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingAsset(null); resetForm(); }} title="Edit Asset" size="lg">
        <form className="space-y-4" onSubmit={handleUpdateAsset}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Asset Name"
              placeholder={'e.g., MacBook Pro 16"'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <Input
              label="Asset Tag"
              placeholder="e.g., AST-013"
              value={formData.assetTag}
              onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
              error={formErrors.assetTag}
            />
            <Dropdown
              label="Category"
              options={assetCategories}
              value={formData.category || 'Laptop'}
              onChange={(val) => setFormData({ ...formData, category: val })}
              placeholder="Select Category"
            />
            <Input
              label="Serial Number"
              placeholder="e.g., SN-XXX-2024"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              error={formErrors.serialNumber}
            />
            <Input
              label="Location"
              placeholder="e.g., Building A, Floor 3"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
            />
            <Dropdown
              label="Condition"
              options={['Excellent', 'Good', 'Fair', 'Poor']}
              value={formData.condition || 'Excellent'}
              onChange={(val) => setFormData({ ...formData, condition: val })}
              placeholder="Select Condition"
            />
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              error={formErrors.purchaseDate}
            />
            <Input
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              error={formErrors.warrantyExpiry}
            />
            <Input
              label="Value ($)"
              type="number"
              placeholder="e.g., 1299.99"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              error={formErrors.value}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => { setShowEditModal(false); setEditingAsset(null); resetForm(); }}>Cancel</Button>
            <Button type="submit">Update Asset</Button>
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
              <StatusBadge status={selectedAsset.status} colorKey={STATUS_COLORS[selectedAsset.status] || 'primary'} />
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
                ['Value', `$${(selectedAsset.value || 0).toLocaleString()}`],
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
