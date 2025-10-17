import React, { useState, useEffect } from 'react'
import './ManageStaff.css'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Search, Filter, UserPlus, Eye, Edit, Trash2, X, Save, User, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
        staffType: editFormData.staffType,
        department: editFormData.department,
        designation: editFormData.designation,
        salary: editFormData.salary,
        updatedAt: new Date().toISOString()
      })

      console.log('Staff updated successfully!')
      
      await fetchStaff()
      setShowEditModal(false)
      setSuccessMessage('Staff updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error updating staff:', error)
      setErrorMessage(`Failed to update staff: ${error.message}`)
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteStaff = async () => {
    try {
      await deleteDoc(doc(db, 'Staff', selectedStaff.id))
      await fetchStaff()
      setShowDeleteModal(false)
      setSuccessMessage('Staff deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting staff:', error)
      setErrorMessage('Failed to delete staff')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  return (
    <div className="manage-staff-container">
      {/* Fixed Alert Messages */}
      {errorMessage && (
        <div className="alert alert-danger alert-fixed">
          <X size={18} />
          <span>{errorMessage}</span>
          <button className="alert-close" onClick={() => setErrorMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-fixed">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
          <button className="alert-close" onClick={() => setSuccessMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}

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
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <div className="modal-header">
              <h2>Edit Staff Details</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="edit-form">
                {/* Personal Information */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editFormData.firstName || ''}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editFormData.lastName || ''}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email || ''}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editFormData.mobile || ''}
                      onChange={handleEditInputChange}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>Staff Type</label>
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

                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department || ''}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={editFormData.designation || ''}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Salary</label>
                    <input
                      type="number"
                      name="salary"
                      value={editFormData.salary || ''}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
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
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="delete-icon">
              <Trash2 size={48} />
            </div>
            <h2>Delete Staff</h2>
            <p>Are you sure you want to delete <strong>{selectedStaff?.firstName} {selectedStaff?.lastName}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleDeleteStaff}>
                <Trash2 size={18} />
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageStaff
