import { useState } from 'react';
import { Users, Monitor, Truck, Box, Plus } from 'lucide-react';

import { bookings, resourceTypes, calendarEvents, bookingStatuses } from '../data/bookings';
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

const resourceIcons = {
  Conference: Users,
  Desk: Monitor,
  Vehicle: Truck,
  Equipment: Box,
};

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.resource.toLowerCase().includes(search.toLowerCase()) ||
      b.bookedBy.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Simple calendar - current week
  const today = new Date();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const columns = [
    {
      key: 'resource',
      label: 'Resource',
      render: (_, row) => {
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tag-bg rounded-lg text-tag-text flex items-center justify-center">
              {(() => {
                const Icon = resourceIcons[row.type] || Box;
                return <Icon className="w-6 h-6" />;
              })()}
            </div>
            <div>
              <p className="font-medium text-name-text">{row.resource}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'resourceType', label: 'Type' },
    { key: 'bookedBy', label: 'Booked By' },
    { key: 'date', label: 'Date' },
    {
      key: 'startTime',
      label: 'Time',
      render: (val, row) => `${val} - ${row.endTime}`,
    },
    { key: 'purpose', label: 'Purpose' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} colorKey={STATUS_COLORS[val]} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Resource Booking</h1>
          <Breadcrumb items={[{ label: 'Resource Booking' }]} />
        </div>
        <div>
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            New Booking
          </Button>
        </div>
      </div>

      {/* Resource Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resourceTypes.map((resource, i) => {
          const IconComp = resourceIcons[resource.name] || Box;
          return (
            <div
              key={resource.id}
              className="fadeinup animation-duration-500"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Card className="text-center">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${resource.color}15` }}
                >
                  <IconComp className="w-7 h-7" style={{ color: resource.color }} />
                </div>
                <h3 className="text-sm font-semibold text-text">{resource.name}</h3>
                <p className="text-xs text-muted mt-1">
                  <span className="text-success font-medium">{resource.available}</span> / {resource.total} available
                </p>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Calendar */}
      <Card hover={false}>
        <h3 className="text-sm font-semibold text-text mb-4">Booking Calendar</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, i) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayEvents = calendarEvents.filter((e) => e.date === dateStr);
            const isToday = date.toDateString() === today.toDateString();
            return (
              <div
                key={i}
                className={`min-h-[120px] rounded-xl border p-2.5 transition-colors ${
                  isToday ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted">{weekDays[i]}</span>
                  <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-text'}`}>
                    {date.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-[10px] p-1.5 rounded-lg text-white font-medium truncate"
                      style={{ backgroundColor: event.color }}
                      title={`${event.title} (${event.time})`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Booking List */}
      <Card hover={false}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search bookings..." />
          </div>
          <div className="flex-1 md:flex-none md:w-1/4">
            <Dropdown options={['', ...bookingStatuses]} value={statusFilter} onChange={setStatusFilter} placeholder="Status" />
          </div>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* New Booking Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Booking">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Booking created'); setShowModal(false); }}>
          <Input label="Resource" placeholder="Select resource..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" />
            <Input label="Start Time" type="time" />
            <Input label="End Time" type="time" />
            <Input label="Attendees" type="number" placeholder="Number of attendees" />
          </div>
          <Input label="Purpose" placeholder="Meeting purpose..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Book Resource</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
