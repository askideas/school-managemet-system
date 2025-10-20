import React, { useState, useEffect } from 'react'
import './ManageStaff.css'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Search, Filter, UserPlus, Eye, Edit, Trash2, X, Save, User, CheckCircle, AlertTriangle, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const ManageStaff = () => {
  const navigate = useNavigate()
  const [staffList, setStaffList] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, [])

  useEffect(() => {
    filterStaff()
  }, [searchTerm, filterType, staffList])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Staff'))
      const staffData = []
      querySnapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() })
      })
      setStaffList(staffData)
      setFilteredStaff(staffData)
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterStaff = () => {
    let filtered = [...staffList]

    if (searchTerm) {
      filtered = filtered.filter(staff => {
        const searchLower = searchTerm.toLowerCase()
        return (
          staff.firstName?.toLowerCase().includes(searchLower) ||
          staff.lastName?.toLowerCase().includes(searchLower) ||
          staff.mobile?.includes(searchTerm) ||
          staff.id?.includes(searchTerm)
        )
      })
    }

    if (filterType) {
      filtered = filtered.filter(staff => staff.staffType === filterType)
    }

    setFilteredStaff(filtered)
  }

  const handleEditClick = (staff) => {
    setSelectedStaff(staff)
    setEditFormData(staff)
    setShowEditModal(true)
  }

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff)
    setShowDeleteModal(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateStaff = async () => {
    try {
      setUpdateLoading(true)

      const staffRef = doc(db, 'Staff', selectedStaff.id)
      await updateDoc(staffRef, {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        mobile: editFormData.mobile,
        dateOfBirth: editFormData.dateOfBirth,
        gender: editFormData.gender,
        address: editFormData.address,
        city: editFormData.city,
        state: editFormData.state,
        pincode: editFormData.pincode,
        staffType: editFormData.staffType,
        department: editFormData.department,
        designation: editFormData.designation,
        qualification: editFormData.qualification,
        experience: editFormData.experience,
        joiningDate: editFormData.joiningDate,
        salary: editFormData.salary,
        bloodGroup: editFormData.bloodGroup,
        emergencyContact: editFormData.emergencyContact,
        emergencyContactName: editFormData.emergencyContactName,
        aadharNumber: editFormData.aadharNumber,
        panNumber: editFormData.panNumber,
        updatedAt: new Date().toISOString()
      })

      console.log('Staff updated successfully!')
      
      await fetchStaff()
      setShowEditModal(false)
      showSuccessToast('Staff updated successfully!')
    } catch (error) {
      console.error('Error updating staff:', error)
      showErrorToast(`Failed to update staff: ${error.message}`)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteStaff = async () => {
    try {
      await deleteDoc(doc(db, 'Staff', selectedStaff.id))
      await fetchStaff()
      setShowDeleteModal(false)
      showSuccessToast('Staff deleted successfully!')
    } catch (error) {
      console.error('Error deleting staff:', error)
      showErrorToast('Failed to delete staff')
    }
  }

  return (
    <div className="manage-staff-container">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, ID, or mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-select">
            <Filter size={18} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Staff Types</option>
              <option value="Teaching Staff">Teaching Staff</option>
              <option value="Non-Teaching Staff">Non-Teaching Staff</option>
              <option value="Administrative Staff">Administrative Staff</option>
              <option value="Support Staff">Support Staff</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button className="add-staff-btn" onClick={() => navigate('/addstaff')}>
            <UserPlus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="staff-table-container">
        {loading ? (
          <div className="loading-state">Loading staff...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="empty-state">No staff found</div>
        ) : (
          <div className="table-wrapper">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Staff Type</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td>
                      <div className="staff-photo">
                        {staff.profileImage ? (
                          <img src={staff.profileImage} alt={staff.firstName} />
                        ) : (
                          <div className="photo-placeholder">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{staff.id}</td>
                    <td>{`${staff.firstName} ${staff.lastName}`}</td>
                    <td>{staff.email}</td>
                    <td>{staff.mobile}</td>
                    <td>
                      <span className="staff-type-badge">{staff.staffType}</span>
                    </td>
                    <td>{staff.department || '-'}</td>
                    <td>{staff.designation || '-'}</td>
                    <td>{staff.joiningDate || '-'}</td>
                    <td>
                      <span className={`status-badge ${staff.status}`}>
                        {staff.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-view" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="btn-edit" onClick={() => handleEditClick(staff)} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteClick(staff)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header p-3">
              <h2>Edit Staff Details</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body p-3">
              <div className="edit-form">
                {/* Personal Information */}
                <h3 className="form-section-title">Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Mobile</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        name="mobile"
                        value={editFormData.mobile || ''}
                        onChange={handleEditInputChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <div className="input-with-icon">
                      <Calendar size={18} className="input-icon" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editFormData.dateOfBirth || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={editFormData.gender || ''}
                      onChange={handleEditInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={editFormData.bloodGroup || ''}
                      onChange={handleEditInputChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aadhar Number</label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={editFormData.aadharNumber || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter Aadhar number"
                      maxLength="12"
                    />
                  </div>

                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={editFormData.panNumber || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter PAN number"
                      maxLength="10"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <h3 className="form-section-title">Address Information</h3>
                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label>Address</label>
                    <div className="input-with-icon">
                      <MapPin size={18} className="input-icon" />
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={editFormData.state || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={editFormData.pincode || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter pincode"
                      maxLength="6"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <h3 className="form-section-title">Professional Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Staff Type</label>
                    <div className="input-with-icon">
                      <Briefcase size={18} className="input-icon" />
                      <select
                        name="staffType"
                        value={editFormData.staffType || ''}
                        onChange={handleEditInputChange}
                      >
                        <option value="">Select Staff Type</option>
                        <option value="Teaching Staff">Teaching Staff</option>
                        <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                        <option value="Administrative Staff">Administrative Staff</option>
                        <option value="Support Staff">Support Staff</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter department"
                    />
                  </div>

                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={editFormData.designation || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter designation"
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={editFormData.qualification || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter qualification"
                    />
                  </div>

                  <div className="form-group">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={editFormData.experience || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter experience"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Joining Date</label>
                    <div className="input-with-icon">
                      <Calendar size={18} className="input-icon" />
                      <input
                        type="date"
                        name="joiningDate"
                        value={editFormData.joiningDate || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Monthly Salary</label>
                    <input
                      type="number"
                      name="salary"
                      value={editFormData.salary || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter salary"
                      min="0"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <h3 className="form-section-title">Emergency Contact</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={editFormData.emergencyContactName || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter contact name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Contact Number</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={editFormData.emergencyContact || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter contact number"
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer p-3" style={{background: '#ffffff'}}>
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="btn-save" onClick={handleUpdateStaff} disabled={updateLoading}>
                <Save size={18} />
                {updateLoading ? 'Updating...' : 'Update Staff'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-icon">
                <AlertTriangle size={48} />
              </div>
              <h2>Delete Staff Member?</h2>
              <p>
                You are about to permanently delete{' '}
                <strong>{selectedStaff?.firstName} {selectedStaff?.lastName}</strong>
              </p>
              <p className="warning-text">
                ⚠️ This action cannot be undone. All staff data will be permanently removed.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleDeleteStaff}>
                <Trash2 size={18} />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageStaff
