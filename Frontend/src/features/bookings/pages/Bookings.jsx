import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBuildingOffice2, HiOutlineBuildingLibrary,
  HiOutlineTv, HiOutlineTruck, HiOutlinePlus,
  HiOutlineCalendar, HiOutlineMapPin, HiOutlineClock,
  HiOutlineUser, HiOutlineTag, HiChevronDown, HiOutlineTrash,
  HiOutlineExclamationTriangle, HiXMark
} from 'react-icons/hi2';
import { bookingService, resourceService, employeeService } from '../../../services';
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
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const resourceIcons = {
  'Meeting Room': HiOutlineBuildingOffice2,
  'Conference Hall': HiOutlineBuildingLibrary,
  'Projector': HiOutlineTv,
  'Company Car': HiOutlineTruck,
};

const iconColors = {
  'Meeting Room': '#4F46E5',
  'Conference Hall': '#818CF8',
  'Projector': '#10B981',
  'Company Car': '#F59E0B',
};

// SearchableSelect helper component
function SearchableSelect({ label, placeholder, options, value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o => 
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-text mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''}`}
      >
        <span className={selected ? 'text-text font-medium' : 'text-muted'}>
          {selected ? selected.label : placeholder}
        </span>
        <HiChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-30 w-full mt-1.5 bg-white rounded-lg border border-gray-200 shadow-lg p-2 max-h-60 overflow-y-auto">
          <input
            type="text"
            className="w-full mb-2 px-3 py-1.5 text-xs rounded border border-gray-200 focus:outline-none focus:border-primary"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="space-y-1">
            {filtered.length === 0 ? (
              <div className="text-xs text-muted py-2 text-center">No options found</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-3 py-2 text-xs text-left rounded hover:bg-gray-50 transition-colors ${opt.value === value ? 'text-primary font-medium bg-primary/5' : 'text-text'}`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function Bookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals / Modifying states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Selected resource detail panel
  const [activeResourceDetail, setActiveResourceDetail] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    asset_id: '',
    employee_id: '',
    date: '',
    start_time: '',
    end_time: '',
    purpose: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Helper date parsing
  const getLocalYYYYMMDD = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getLocalHHMM = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const getResourceDetails = (resource) => {
    if (!resource) return null;
    const name = resource.asset_name || '';
    if (name.includes('Room A')) {
      return { capacity: 8, equipment: 'Whiteboard, Projector, Conference Phone' };
    } else if (name.includes('Room B')) {
      return { capacity: 12, equipment: 'Interactive Display, Video Conferencing, Whiteboard' };
    } else if (name.includes('Room C')) {
      return { capacity: 6, equipment: 'TV Screen, Whiteboard' };
    } else if (name.includes('Conference Hall A')) {
      return { capacity: 40, equipment: 'Stage, Sound System, Dual Projectors, Mic' };
    } else if (name.includes('Conference Hall B')) {
      return { capacity: 25, equipment: 'Projector, Sound System, Conference Table' };
    } else if (name.includes('Car') || name.includes('Toyota')) {
      return { capacity: 5, equipment: 'GPS, Dashcam, First Aid Kit' };
    } else if (resource.category_name === 'Projector' || name.includes('Projector')) {
      return { capacity: 'N/A', equipment: 'HDMI Cable, Remote Control, Carrying Case' };
    }
    return { capacity: 4, equipment: 'Standard Workspace Setup' };
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    const diffMs = new Date(endTime) - new Date(startTime);
    if (diffMs <= 0) return 'Invalid Time';
    const diffMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    let result = '';
    if (hrs > 0) result += `${hrs} hr${hrs > 1 ? 's' : ''} `;
    if (mins > 0) result += `${mins} min${mins > 1 ? 's' : ''}`;
    return result.trim();
  };

  const calculateFormDuration = () => {
    if (!formData.date || !formData.start_time || !formData.end_time) return '';
    const startStr = `${formData.date}T${formData.start_time}:00`;
    const endStr = `${formData.date}T${formData.end_time}:00`;
    return calculateDuration(startStr, endStr);
  };

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [bookingsData, resourcesData, employeesData] = await Promise.all([
        bookingService.getAll(),
        resourceService.getAll({ limit: 100 }),
        employeeService.getAll(),
      ]);

      setBookingsList(bookingsData || []);
      setResourcesList(resourcesData?.resources || []);
      setEmployeesList(employeesData || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenNewModal = () => {
    setSelectedBooking(null);
    setIsEditing(false);
    setFormErrors({});
    setFormData({
      asset_id: '',
      employee_id: '',
      date: getLocalYYYYMMDD(new Date()),
      start_time: '09:00',
      end_time: '10:00',
      purpose: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
    setFormErrors({});
    setFormData({
      asset_id: booking.asset_id,
      employee_id: booking.employee_id,
      date: getLocalYYYYMMDD(booking.start_time),
      start_time: getLocalHHMM(booking.start_time),
      end_time: getLocalHHMM(booking.end_time),
      purpose: booking.purpose || '',
      status: booking.status,
    });
    setShowModal(true);
  };

  // Cancel Booking Action
  const handleCancelBooking = async (id) => {
    const confirmation = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmation) return;

    try {
      const loadingToast = toast.loading('Cancelling booking...');
      await bookingService.cancel(id);
      toast.dismiss(loadingToast);
      toast.success('Booking cancelled successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  // Delete Booking Action
  const handleDeleteBooking = async (id) => {
    const confirmation = window.confirm('Are you sure you want to delete this booking permanently?');
    if (!confirmation) return;

    try {
      const loadingToast = toast.loading('Deleting booking...');
      await bookingService.delete(id);
      toast.dismiss(loadingToast);
      toast.success('Booking deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete booking');
    }
  };

  // Handle Form Submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const errors = {};
    if (!formData.asset_id) errors.asset_id = 'Resource is required';
    if (!formData.employee_id) errors.employee_id = 'Employee is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.start_time) errors.start_time = 'Start time is required';
    if (!formData.end_time) errors.end_time = 'End time is required';

    const startStr = `${formData.date}T${formData.start_time}:00`;
    const endStr = `${formData.date}T${formData.end_time}:00`;

    if (new Date(startStr) >= new Date(endStr)) {
      errors.end_time = 'End time must be after start time';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      asset_id: parseInt(formData.asset_id, 10),
      employee_id: parseInt(formData.employee_id, 10),
      start_time: new Date(startStr).toISOString(),
      end_time: new Date(endStr).toISOString(),
      purpose: formData.purpose,
    };

    if (isEditing) {
      payload.status = formData.status;
    }

    try {
      const loadingToast = toast.loading(isEditing ? 'Updating booking...' : 'Creating booking...');
      if (isEditing) {
        await bookingService.update(selectedBooking.booking_id, payload);
        toast.dismiss(loadingToast);
        toast.success('Booking updated successfully');
      } else {
        await bookingService.create(payload);
        toast.dismiss(loadingToast);
        toast.success('Booking created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.dismiss();
      const serverMessage = error.response?.data?.message;
      if (serverMessage && serverMessage.includes('overlap')) {
        setFormErrors({ end_time: 'Selected time slot overlaps with an existing booking.' });
        toast.error('Booking conflict detected');
      } else {
        toast.error(serverMessage || 'An error occurred while saving the booking.');
      }
    }
  };

  // Dynamic values computation
  const initialCategories = [
    { name: 'Meeting Room', icon: 'HiOutlineBuildingOffice2', color: '#4F46E5' },
    { name: 'Conference Hall', icon: 'HiOutlineBuildingLibrary', color: '#818CF8' },
    { name: 'Projector', icon: 'HiOutlineTv', color: '#10B981' },
    { name: 'Company Car', icon: 'HiOutlineTruck', color: '#F59E0B' },
  ];

  const categoryStats = initialCategories.map((cat) => {
    const matchingResources = resourcesList.filter(r => r.category_name === cat.name);
    const total = matchingResources.length;
    const available = matchingResources.filter(r => r.status === 'AVAILABLE').length;
    return {
      ...cat,
      total,
      available,
    };
  });

  // Filters application
  const filteredBookings = bookingsList.filter((b) => {
    const resourceName = b.resource_name || '';
    const employeeName = b.employee_name || '';
    const purpose = b.purpose || '';

    const matchesSearch =
      resourceName.toLowerCase().includes(search.toLowerCase()) ||
      employeeName.toLowerCase().includes(search.toLowerCase()) ||
      purpose.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || b.status === statusFilter;
    const matchesCategory = !categoryFilter || b.resource_type === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calendar rendering helper - current week starting Monday
  const today = new Date();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const startOfWeek = new Date(today);
  // Reset time to start of day
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
  
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // Select options mapping
  const resourceOptions = resourcesList
    .filter(r => r.status === 'AVAILABLE' || r.status === 'RESERVED')
    .map(r => ({
      value: r.id,
      label: `${r.asset_name} (${r.location || 'No Location'}) - ${r.status}`,
    }));

  const employeeOptions = employeesList.map(e => ({
    value: e.id,
    label: `${e.name} (${e.department || 'N/A'})`,
  }));

  const selectedRes = resourcesList.find(r => r.id === parseInt(formData.asset_id, 10));
  const selectedResDetails = getResourceDetails(selectedRes);

  const columns = [
    {
      key: 'resource_name',
      label: 'Resource',
      render: (val, row) => {
        const Icon = resourceIcons[row.resource_type] || HiOutlineBuildingOffice2;
        const color = iconColors[row.resource_type] || '#6366f1';
        return (
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
            </div>
            <div
              className="cursor-pointer group flex flex-col"
              onClick={() => setActiveResourceDetail(resourcesList.find(r => r.id === row.asset_id))}
            >
              <span className="font-semibold text-text group-hover:text-primary transition-colors flex items-center gap-1.5">
                {val}
                <span className="text-[10px] bg-gray-100 text-muted px-1.5 py-0.5 rounded border border-gray-200">View</span>
              </span>
              <span className="text-xs text-muted font-normal flex items-center gap-1 mt-0.5">
                <HiOutlineMapPin className="w-3.5 h-3.5 text-muted flex-shrink-0" /> {row.location || 'N/A'}
              </span>
            </div>
          </div>
        );
      },
    },
    { key: 'resource_type', label: 'Type' },
    { key: 'employee_name', label: 'Booked By' },
    {
      key: 'date',
      label: 'Date',
      render: (val, row) => getLocalYYYYMMDD(row.start_time),
    },
    {
      key: 'time_range',
      label: 'Time Window',
      render: (val, row) => {
        const start = getLocalHHMM(row.start_time);
        const end = getLocalHHMM(row.end_time);
        return `${start} - ${end}`;
      },
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (val, row) => calculateDuration(row.start_time, row.end_time),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {row.status === 'UPCOMING' && (
            <button
              onClick={() => handleCancelBooking(row.booking_id)}
              className="text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded text-xs font-semibold border border-amber-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => handleOpenEditModal(row)}
            className="text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded text-xs font-semibold border border-primary/10 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteBooking(row.booking_id)}
            className="text-danger hover:text-danger-dark bg-danger/5 hover:bg-danger/10 p-1.5 rounded text-xs border border-danger/10 transition-colors"
            title="Delete booking"
          >
            <HiOutlineTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Resource Booking</h1>
          <Breadcrumb items={[{ label: 'Resource Booking' }]} />
        </div>
        <Button icon={HiOutlinePlus} onClick={handleOpenNewModal}>
          New Booking
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner className="w-8 h-8 text-primary" />
        </div>
      ) : (
        <>
          {/* Resource Category Filter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((cat, i) => {
              const Icon = resourceIcons[cat.name] || HiOutlineBuildingOffice2;
              const isSelected = categoryFilter === cat.name;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setCategoryFilter(isSelected ? '' : cat.name)}
                  className="cursor-pointer"
                >
                  <Card 
                    className={`text-center transition-all border duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'border-primary ring-2 ring-primary/10 bg-primary/[0.02]' 
                        : 'border-transparent'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform hover:scale-105"
                      style={{ backgroundColor: `${iconColors[cat.name] || '#6366F1'}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: iconColors[cat.name] || '#6366F1' }} />
                    </div>
                    <h3 className="text-sm font-semibold text-text">{cat.name}</h3>
                    <p className="text-xs text-muted mt-1">
                      <span className="text-success font-semibold">{cat.available}</span> / {cat.total} available
                    </p>
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-primary mt-2 block">
                        Filtering Enabled
                      </span>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Booking Calendar (Live source of truth) */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text flex items-center gap-1.5">
                <HiOutlineCalendar className="w-4 h-4 text-primary" /> Booking Calendar (This Week)
              </h3>
              <span className="text-xs text-muted font-medium bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Live Data Source
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {weekDates.map((date, i) => {
                const dateStr = getLocalYYYYMMDD(date);
                const dayEvents = bookingsList.filter((b) => {
                  if (b.status === 'CANCELLED') return false;
                  return getLocalYYYYMMDD(b.start_time) === dateStr;
                });
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={i}
                    className={`min-h-[140px] rounded-xl border p-3 flex flex-col transition-all ${
                      isToday 
                        ? 'border-primary bg-primary/[0.03] shadow-sm ring-1 ring-primary/5' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-100">
                      <span className="text-xs font-semibold text-muted">{weekDays[i]}</span>
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-primary text-white' : 'text-text'
                      }`}>
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-y-auto max-h-24">
                      {dayEvents.length === 0 ? (
                        <span className="text-[10px] text-muted/60 italic block text-center pt-2">
                          No bookings
                        </span>
                      ) : (
                        dayEvents.map((event) => {
                          const catColor = iconColors[event.resource_type] || '#4F46E5';
                          const start = getLocalHHMM(event.start_time);
                          const end = getLocalHHMM(event.end_time);
                          return (
                            <div
                              key={event.booking_id}
                              className="text-[10px] p-1.5 rounded-lg text-white font-medium truncate shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
                              style={{ backgroundColor: catColor }}
                              title={`${event.resource_name}\nTime: ${start}-${end}\nPurpose: ${event.purpose}`}
                              onClick={() => handleOpenEditModal(event)}
                            >
                              <div className="truncate font-semibold">{event.resource_name}</div>
                              <div className="text-[9px] opacity-90">{start} - {end}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Booking List Table */}
          <Card hover={false}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} placeholder="Search by resource, user or purpose..." />
              </div>
              <div className="w-44">
                <Dropdown 
                  options={['', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']} 
                  value={statusFilter} 
                  onChange={setStatusFilter} 
                  placeholder="All Statuses" 
                />
              </div>
              {(statusFilter || categoryFilter || search) && (
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setCategoryFilter('');
                    setSearch('');
                  }}
                  className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors px-2"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <HiOutlineExclamationTriangle className="w-10 h-10 text-muted mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-text">No Bookings Found</h4>
                <p className="text-xs text-muted mt-1 max-w-md mx-auto">
                  There are no bookings matching your current filter choices. Try adjusting filters or schedule a new booking.
                </p>
                <Button size="sm" className="mt-4" icon={HiOutlinePlus} onClick={handleOpenNewModal}>
                  Create Booking
                </Button>
              </div>
            ) : (
              <Table columns={columns} data={filteredBookings} />
            )}
          </Card>
        </>
      )}

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {activeResourceDetail && (
          <Modal 
            isOpen={!!activeResourceDetail} 
            onClose={() => setActiveResourceDetail(null)} 
            title="Resource Details"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${iconColors[activeResourceDetail.category_name] || '#6366F1'}15` }}
                >
                  {(() => {
                    const Icon = resourceIcons[activeResourceDetail.category_name] || HiOutlineBuildingOffice2;
                    return <Icon className="w-8 h-8" style={{ color: iconColors[activeResourceDetail.category_name] || '#6366F1' }} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">{activeResourceDetail.asset_name}</h3>
                  <span className="text-xs text-muted block mt-0.5">{activeResourceDetail.asset_tag}</span>
                  <StatusBadge status={activeResourceDetail.status} colorKey={STATUS_COLORS[activeResourceDetail.status]} className="mt-2" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted block text-xs">Category</span>
                  <span className="font-semibold text-text mt-0.5 block">{activeResourceDetail.category_name}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Location</span>
                  <span className="font-semibold text-text mt-0.5 block flex items-center gap-1">
                    <HiOutlineMapPin className="w-4 h-4 text-muted" /> {activeResourceDetail.location || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Condition</span>
                  <span className="font-semibold text-text mt-0.5 block">{activeResourceDetail.condition || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Capacity</span>
                  <span className="font-semibold text-text mt-0.5 block">
                    {getResourceDetails(activeResourceDetail)?.capacity || 'N/A'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted block text-xs">Included Equipment</span>
                  <span className="font-semibold text-text mt-0.5 block">
                    {getResourceDetails(activeResourceDetail)?.equipment || 'None'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Upcoming Schedule</h4>
                {bookingsList.filter(b => b.asset_id === activeResourceDetail.id && b.status !== 'CANCELLED').length === 0 ? (
                  <p className="text-xs text-muted/80 italic">No future bookings scheduled for this resource.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bookingsList
                      .filter(b => b.asset_id === activeResourceDetail.id && b.status !== 'CANCELLED')
                      .map((b) => (
                        <div key={b.booking_id} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-text block">{b.purpose || 'No Purpose'}</span>
                            <span className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                              <HiOutlineUser className="w-3 h-3" /> {b.employee_name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-text block font-medium">{getLocalYYYYMMDD(b.start_time)}</span>
                            <span className="text-[10px] text-muted block mt-0.5">
                              {getLocalHHMM(b.start_time)} - {getLocalHHMM(b.end_time)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3">
                <Button onClick={() => setActiveResourceDetail(null)}>Close</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* New/Edit Booking Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Booking' : 'New Booking'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isEditing && (
            <div className="w-full">
              <label className="block text-sm font-medium text-text mb-1.5">Booking Status</label>
              <Dropdown
                options={['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']}
                value={formData.status}
                onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
              />
            </div>
          )}

          <SearchableSelect
            label="Resource"
            placeholder="Select a shared resource..."
            options={resourceOptions}
            value={formData.asset_id}
            onChange={(val) => setFormData(prev => ({ ...prev, asset_id: val }))}
            error={formErrors.asset_id}
          />

          {/* Selected Resource Live Details in Form */}
          {selectedRes && (
            <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Location:</span>
                <span className="text-text font-medium">{selectedRes.location || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Capacity:</span>
                <span className="text-text font-medium">{selectedResDetails?.capacity || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Equipment:</span>
                <span className="text-text font-medium text-right max-w-[200px]">{selectedResDetails?.equipment || 'None'}</span>
              </div>
            </div>
          )}

          <SearchableSelect
            label="Employee"
            placeholder="Select employee..."
            options={employeeOptions}
            value={formData.employee_id}
            onChange={(val) => setFormData(prev => ({ ...prev, employee_id: val }))}
            error={formErrors.employee_id}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input 
              label="Date" 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              error={formErrors.date}
            />
            <Input 
              label="Start Time" 
              type="time" 
              value={formData.start_time}
              onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              error={formErrors.start_time}
            />
            <Input 
              label="End Time" 
              type="time" 
              value={formData.end_time}
              onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              error={formErrors.end_time}
            />
          </div>

          {/* Live Duration Calculation UI */}
          {calculateFormDuration() && (
            <div className="text-xs bg-primary/5 text-primary border border-primary/10 rounded-lg p-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium">
                <HiOutlineClock className="w-3.5 h-3.5" /> Computed Duration
              </span>
              <span className="font-bold">{calculateFormDuration()}</span>
            </div>
          )}

          <Input 
            label="Purpose" 
            placeholder="Meeting purpose..." 
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            error={formErrors.purpose}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Book Resource'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}