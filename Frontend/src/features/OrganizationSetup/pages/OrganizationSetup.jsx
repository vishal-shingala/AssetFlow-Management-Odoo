import { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { STATUS_COLORS } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/ui/SearchBar';
import Dropdown from '../../../components/ui/Dropdown';
import StatusBadge from '../../../components/ui/StatusBadge';
import OrganizationTabs from '../components/OrganizationTabs';
import AddDepartmentModal from '../components/AddDepartmentModal';
import { getDepartments, createDepartment } from '../api/organizationApi';
import { departments } from '../data/departments';

const TABS = ['Departments', 'Categories', 'Employee'];

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('Departments');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to mock data only in development
      if (import.meta.env.DEV) {
        setDepartments(departments);
      } else {
        setDepartments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
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

  const filtered = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch = dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.head.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || dept.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, departments]);

  const columns = useMemo(() => [
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
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Organization Setup</h1>
          <Breadcrumb items={[{ label: 'Organization Setup' }]} />
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add
        </Button>
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
          <Table columns={columns} data={filtered} loading={loading} />
        </Card>
      )}

      {activeTab === 'Categories' && (
        <Card hover={false}>
          <div className="text-center py-12 text-muted">
            <p>Categories management coming soon</p>
          </div>
        </Card>
      )}

      {activeTab === 'Employee' && (
        <Card hover={false}>
          <div className="text-center py-12 text-muted">
            <p>Employee management coming soon</p>
          </div>
        </Card>
      )}

      <AddDepartmentModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSubmit={handleAddDepartment} 
      />
    </div>
  );
}
