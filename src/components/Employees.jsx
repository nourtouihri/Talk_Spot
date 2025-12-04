import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  User,
  Plus,
  X
} from 'lucide-react';

const DEFAULT_AVATAR = '/default-avatar.png';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    avatar: '',
    hireDate: '',
    birthDate: ''
  });

  // confirmation modal state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

  // unique department list
  const departments = ['all', ...new Set(employees.map(u => u.department))];

  // filter logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // lookup for detail modal
  const selectedEmployeeData = selectedEmployee
    ? employees.find(u => u.id === selectedEmployee)
    : null;

  // ADD
  const handleAddEmployee = e => {
    e.preventDefault();
    const newEmp = { id: Date.now().toString(), ...formData };
    setEmployees([newEmp, ...employees]);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      avatar: '',
      hireDate: '',
      birthDate: ''
    });
    setAvatarPreview('');
    setShowAddForm(false);
  };

  // DELETE after confirmation
  const handleDelete = id => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setShowConfirmDelete(false);
  };

  // on-click: close detail & open confirm
  const handleDeleteClick = id => {
    setSelectedEmployee(null);
    setDeleteEmployeeId(id);
    setShowConfirmDelete(true);
  };

  // avatar fallback
  const renderAvatar = (src, classes = '') => (
    <img
      src={src || DEFAULT_AVATAR}
      onError={e => {
        e.target.onerror = null;
        e.target.src = DEFAULT_AVATAR;
      }}
      className={classes}
      alt="avatar"
    />
  );

  return (
    <div className="space-y-6">

      {/* Directory Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Directory
          </h2>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => (
              <div
                key={emp.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md cursor-pointer"
                onClick={() => setSelectedEmployee(emp.id)}
              >
                <div className="flex items-center space-x-4">
                  {renderAvatar(emp.avatar, 'h-16 w-16 rounded-full')}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{emp.position}</p>
                    <p className="text-sm text-gray-500">{emp.department}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {emp.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {emp.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployeeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Employee Details
              </h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      {selectedEmployeeData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">
                      {selectedEmployeeData.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Department
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedEmployeeData.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Position</p>
                    <p className="text-sm text-gray-600">
                      {selectedEmployeeData.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hire Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        selectedEmployeeData.hireDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Birthday</p>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        selectedEmployeeData.birthDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === 'admin' && (
                <div className="p-6 flex justify-end">
                  <button
                    onClick={() => handleDeleteClick(selectedEmployeeData.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-all"
                  >
                    Delete Employee
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Form Modal */}
      {user?.role === 'admin' && showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Employee
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', key: 'firstName', type: 'text' },
                  { label: 'Last Name',  key: 'lastName',  type: 'text' },
                  { label: 'Email',      key: 'email',     type: 'email' },
                  { label: 'Phone',      key: 'phone',     type: 'text' },
                  { label: 'Position',   key: 'position',  type: 'text' },
                  { label: 'Dept',       key: 'department',type: 'text' },
                  { label: 'Avatar URL', key: 'avatar',    type: 'url' },
                  { label: 'Hire Date',  key: 'hireDate',  type: 'date' },
                  { label: 'Birthday',   key: 'birthDate', type: 'date' }
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required
                      value={formData[field.key]}
                      onChange={e => {
                        setFormData({ ...formData, [field.key]: e.target.value });
                        if (field.key === 'avatar') {
                          setAvatarPreview(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300"
                    />
                  </div>
                ))}
              </div>

              {avatarPreview && (
                <div className="flex justify-center mt-2">
                  {renderAvatar(avatarPreview, 'h-20 w-20 rounded-full')}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border-transparent rounded-md hover:bg-green-700"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={() => handleDelete(deleteEmployeeId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border-transparent rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;
