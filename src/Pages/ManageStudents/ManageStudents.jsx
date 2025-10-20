import React, { useState, useEffect } from 'react'
import './ManageStudents.css'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Search, Filter, UserPlus, Eye, Edit, Trash2, X, Save, User, CheckCircle, AlertTriangle, Mail, Phone, MapPin, Calendar, GraduationCap, Users, Hash, School } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const ManageStudents = () => {
  const navigate = useNavigate()
  const [studentsList, setStudentsList] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [searchTerm, filterClass, filterSection, filterStatus, studentsList])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchStudents(),
        fetchClasses(),
        fetchSections()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Students'))
      const studentsData = []
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() })
      })
      setStudentsList(studentsData)
      setFilteredStudents(studentsData)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchClasses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Classes'))
      const classesData = []
      querySnapshot.forEach((doc) => {
        classesData.push({ id: doc.id, ...doc.data() })
      })
      setClasses(classesData)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchSections = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Sections'))
      const sectionsData = []
      querySnapshot.forEach((doc) => {
        sectionsData.push({ id: doc.id, ...doc.data() })
      })
      setSections(sectionsData)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const filterStudents = () => {
    let filtered = [...studentsList]

    if (searchTerm) {
      filtered = filtered.filter(student => {
        const searchLower = searchTerm.toLowerCase()
        return (
          student.firstName?.toLowerCase().includes(searchLower) ||
          student.lastName?.toLowerCase().includes(searchLower) ||
          student.admissionNumber?.includes(searchTerm) ||
          student.mobile?.includes(searchTerm) ||
          student.email?.toLowerCase().includes(searchLower) ||
          student.rollNumber?.includes(searchTerm)
        )
      })
    }

    if (filterClass) {
      filtered = filtered.filter(student => student.classId === filterClass)
    }

    if (filterSection) {
      filtered = filtered.filter(student => student.sectionId === filterSection)
    }

    if (filterStatus) {
      filtered = filtered.filter(student => student.status === filterStatus)
    }

    setFilteredStudents(filtered)
  }

  const handleViewClick = (student) => {
    setSelectedStudent(student)
    setShowViewModal(true)
  }

  const handleEditClick = (student) => {
    setSelectedStudent(student)
    setEditFormData(student)
    setShowEditModal(true)
  }

  const handleDeleteClick = (student) => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateStudent = async () => {
    try {
      setUpdateLoading(true)

      const studentRef = doc(db, 'Students', selectedStudent.admissionNumber)
      await updateDoc(studentRef, {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        mobile: editFormData.mobile,
        dateOfBirth: editFormData.dateOfBirth,
        gender: editFormData.gender,
        bloodGroup: editFormData.bloodGroup,
        religion: editFormData.religion,
        caste: editFormData.caste,
        nationality: editFormData.nationality,
        motherTongue: editFormData.motherTongue,
        address: editFormData.address,
        city: editFormData.city,
        state: editFormData.state,
        pincode: editFormData.pincode,
        rollNumber: editFormData.rollNumber,
        academicYear: editFormData.academicYear,
        previousSchool: editFormData.previousSchool,
        fatherName: editFormData.fatherName,
        fatherOccupation: editFormData.fatherOccupation,
        fatherPhone: editFormData.fatherPhone,
        fatherEmail: editFormData.fatherEmail,
        motherName: editFormData.motherName,
        motherOccupation: editFormData.motherOccupation,
        motherPhone: editFormData.motherPhone,
        motherEmail: editFormData.motherEmail,
        emergencyContactName: editFormData.emergencyContactName,
        emergencyContactPhone: editFormData.emergencyContactPhone,
        emergencyContactRelation: editFormData.emergencyContactRelation,
        transportRequired: editFormData.transportRequired,
        hostelRequired: editFormData.hostelRequired,
        medicalConditions: editFormData.medicalConditions,
        allergies: editFormData.allergies,
        specialNeeds: editFormData.specialNeeds,
        updatedAt: new Date().toISOString()
      })

      await fetchStudents()
      setShowEditModal(false)
      showSuccessToast('Student updated successfully!')
    } catch (error) {
      console.error('Error updating student:', error)
      showErrorToast(`Failed to update student: ${error.message}`)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteStudent = async () => {
    try {
      await deleteDoc(doc(db, 'Students', selectedStudent.admissionNumber))
      await fetchStudents()
      setShowDeleteModal(false)
      showSuccessToast('Student deleted successfully!')
    } catch (error) {
      console.error('Error deleting student:', error)
      showErrorToast('Failed to delete student')
    }
  }

  const getAvailableSections = () => {
    if (!filterClass) return sections
    return sections.filter(section => section.classId === filterClass)
  }

  return (
    <div className="manage-students-container">
      {/* Search and Filter Section */}
      <div className="students-search-filter-section">
        <div className="students-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, admission number, roll number, mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="students-filter-controls">
          <div className="students-filter-select">
            <School size={18} />
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="">All Classes</option>
              {classes.map((classItem) => (
                <option key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </option>
              ))}
            </select>
          </div>

          <div className="students-filter-select">
            <Users size={18} />
            <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
              <option value="">All Sections</option>
              {getAvailableSections().map((section) => (
                <option key={section.sectionId} value={section.sectionId}>
                  Section {section.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div className="students-filter-select">
            <Filter size={18} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>

          <button className="students-add-btn" onClick={() => navigate('/addstudent')}>
            <UserPlus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-table-container">
        {loading ? (
          <div className="students-loading-state">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="students-empty-state">No students found</div>
        ) : (
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Admission No.</th>
                  <th>Student Name</th>
                  <th>Class & Section</th>
                  <th>Roll Number</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Father Name</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.admissionNumber}>
                    <td>
                      <div className="students-photo">
                        {student.profileImage ? (
                          <img src={student.profileImage} alt={student.firstName} />
                        ) : (
                          <div className="students-photo-placeholder">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="students-admission-number">{student.admissionNumber}</span>
                    </td>
                    <td>
                      <div className="students-name-info">
                        <span className="students-full-name">{`${student.firstName} ${student.lastName}`}</span>
                        <span className="students-gender">{student.gender}</span>
                      </div>
                    </td>
                    <td>
                      <div className="students-class-info">
                        <span className="students-class">{student.className}</span>
                        <span className="students-section">Section {student.sectionName}</span>
                      </div>
                    </td>
                    <td>{student.rollNumber || '-'}</td>
                    <td>{student.email || '-'}</td>
                    <td>{student.mobile || '-'}</td>
                    <td>{student.fatherName || '-'}</td>
                    <td>{student.academicYear || '-'}</td>
                    <td>
                      <span className={`students-status-badge ${student.status || 'active'}`}>
                        {student.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="students-action-buttons">
                        <button className="students-btn-view" onClick={() => handleViewClick(student)} title="View">
                          <Eye size={16} />
                        </button>
                        <button className="students-btn-edit" onClick={() => handleEditClick(student)} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="students-btn-delete" onClick={() => handleDeleteClick(student)} title="Delete">
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

      {/* View Modal */}
      {showViewModal && selectedStudent && (
        <div className="students-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="students-modal-content students-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="students-modal-header">
              <h2>Student Details</h2>
              <button className="students-close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="students-modal-body">
              {/* Student Photo and Basic Info */}
              <div className="students-profile-section">
                <div className="students-profile-photo">
                  {selectedStudent.profileImage ? (
                    <img src={selectedStudent.profileImage} alt={selectedStudent.firstName} />
                  ) : (
                    <div className="students-photo-placeholder-large">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="students-profile-info">
                  <h3>{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</h3>
                  <p className="students-admission-info">Admission No: {selectedStudent.admissionNumber}</p>
                  <p className="students-class-section">{selectedStudent.className} - Section {selectedStudent.sectionName}</p>
                  <span className={`students-status-badge ${selectedStudent.status || 'active'}`}>
                    {selectedStudent.status || 'active'}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div className="students-info-section">
                <h4 className="students-section-title">Personal Information</h4>
                <div className="students-info-grid">
                  <div className="students-info-item">
                    <label>Date of Birth</label>
                    <span>{selectedStudent.dateOfBirth || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Gender</label>
                    <span>{selectedStudent.gender || 'Not specified'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Blood Group</label>
                    <span>{selectedStudent.bloodGroup || 'Not specified'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Religion</label>
                    <span>{selectedStudent.religion || 'Not specified'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Caste</label>
                    <span>{selectedStudent.caste || 'Not specified'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Nationality</label>
                    <span>{selectedStudent.nationality || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="students-info-section">
                <h4 className="students-section-title">Contact Information</h4>
                <div className="students-info-grid">
                  <div className="students-info-item">
                    <label>Email</label>
                    <span>{selectedStudent.email || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Mobile</label>
                    <span>{selectedStudent.mobile || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item students-full-width">
                    <label>Address</label>
                    <span>{selectedStudent.address || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>City</label>
                    <span>{selectedStudent.city || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>State</label>
                    <span>{selectedStudent.state || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Pincode</label>
                    <span>{selectedStudent.pincode || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="students-info-section">
                <h4 className="students-section-title">Parent Information</h4>
                <div className="students-info-grid">
                  <div className="students-info-item">
                    <label>Father's Name</label>
                    <span>{selectedStudent.fatherName || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Father's Occupation</label>
                    <span>{selectedStudent.fatherOccupation || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Father's Phone</label>
                    <span>{selectedStudent.fatherPhone || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Mother's Name</label>
                    <span>{selectedStudent.motherName || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Mother's Occupation</label>
                    <span>{selectedStudent.motherOccupation || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Mother's Phone</label>
                    <span>{selectedStudent.motherPhone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="students-info-section">
                <h4 className="students-section-title">Academic Information</h4>
                <div className="students-info-grid">
                  <div className="students-info-item">
                    <label>Roll Number</label>
                    <span>{selectedStudent.rollNumber || 'Not assigned'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Academic Year</label>
                    <span>{selectedStudent.academicYear || 'Not specified'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Admission Date</label>
                    <span>{selectedStudent.admissionDate || 'Not provided'}</span>
                  </div>
                  <div className="students-info-item">
                    <label>Previous School</label>
                    <span>{selectedStudent.previousSchool || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="students-modal-footer">
              <button className="students-btn-cancel" onClick={() => setShowViewModal(false)}>
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStudent && (
        <div className="students-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="students-modal-content students-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="students-modal-header">
              <h2>Edit Student Details</h2>
              <button className="students-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="students-modal-body">
              <div className="students-edit-form">
                {/* Personal Information */}
                <h3 className="students-form-section-title">Personal Information</h3>
                <div className="students-form-grid">
                  <div className="students-form-group">
                    <label>First Name</label>
                    <div className="students-input-with-icon">
                      <User size={18} className="students-input-icon" />
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>Last Name</label>
                    <div className="students-input-with-icon">
                      <User size={18} className="students-input-icon" />
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>Email</label>
                    <div className="students-input-with-icon">
                      <Mail size={18} className="students-input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>Mobile</label>
                    <div className="students-input-with-icon">
                      <Phone size={18} className="students-input-icon" />
                      <input
                        type="tel"
                        name="mobile"
                        value={editFormData.mobile || ''}
                        onChange={handleEditInputChange}
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>Date of Birth</label>
                    <div className="students-input-with-icon">
                      <Calendar size={18} className="students-input-icon" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editFormData.dateOfBirth || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
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

                  <div className="students-form-group">
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

                  <div className="students-form-group">
                    <label>Religion</label>
                    <input
                      type="text"
                      name="religion"
                      value={editFormData.religion || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter religion"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <h3 className="students-form-section-title">Address Information</h3>
                <div className="students-form-grid">
                  <div className="students-form-group students-form-group-full">
                    <label>Address</label>
                    <div className="students-input-with-icon">
                      <MapPin size={18} className="students-input-icon" />
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={editFormData.state || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="students-form-group">
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

                {/* Academic Information */}
                <h3 className="students-form-section-title">Academic Information</h3>
                <div className="students-form-grid">
                  <div className="students-form-group">
                    <label>Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={editFormData.rollNumber || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter roll number"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>Academic Year</label>
                    <select
                      name="academicYear"
                      value={editFormData.academicYear || ''}
                      onChange={handleEditInputChange}
                    >
                      <option value="">Select Academic Year</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2026-27">2026-27</option>
                    </select>
                  </div>

                  <div className="students-form-group">
                    <label>Previous School</label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={editFormData.previousSchool || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter previous school"
                    />
                  </div>
                </div>

                {/* Parent Information */}
                <h3 className="students-form-section-title">Parent Information</h3>
                <div className="students-form-grid">
                  <div className="students-form-group">
                    <label>Father's Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={editFormData.fatherName || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter father's name"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>Father's Occupation</label>
                    <input
                      type="text"
                      name="fatherOccupation"
                      value={editFormData.fatherOccupation || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter father's occupation"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>Father's Phone</label>
                    <div className="students-input-with-icon">
                      <Phone size={18} className="students-input-icon" />
                      <input
                        type="tel"
                        name="fatherPhone"
                        value={editFormData.fatherPhone || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter father's phone"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={editFormData.motherName || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter mother's name"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>Mother's Occupation</label>
                    <input
                      type="text"
                      name="motherOccupation"
                      value={editFormData.motherOccupation || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter mother's occupation"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>Mother's Phone</label>
                    <div className="students-input-with-icon">
                      <Phone size={18} className="students-input-icon" />
                      <input
                        type="tel"
                        name="motherPhone"
                        value={editFormData.motherPhone || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter mother's phone"
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <h3 className="students-form-section-title">Emergency Contact</h3>
                <div className="students-form-grid">
                  <div className="students-form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={editFormData.emergencyContactName || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter contact name"
                    />
                  </div>

                  <div className="students-form-group">
                    <label>Emergency Contact Phone</label>
                    <div className="students-input-with-icon">
                      <Phone size={18} className="students-input-icon" />
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={editFormData.emergencyContactPhone || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter contact phone"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <div className="students-form-group">
                    <label>Relation</label>
                    <input
                      type="text"
                      name="emergencyContactRelation"
                      value={editFormData.emergencyContactRelation || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter relation"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <h3 className="students-form-section-title">Additional Information</h3>
                <div className="students-form-grid">
                  <div className="students-form-group students-form-group-full">
                    <label>Medical Conditions</label>
                    <textarea
                      name="medicalConditions"
                      value={editFormData.medicalConditions || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter medical conditions"
                      rows="3"
                    />
                  </div>

                  <div className="students-form-group students-form-group-full">
                    <label>Allergies</label>
                    <textarea
                      name="allergies"
                      value={editFormData.allergies || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter allergies"
                      rows="3"
                    />
                  </div>

                  <div className="students-form-group students-form-group-full">
                    <label>Special Needs</label>
                    <textarea
                      name="specialNeeds"
                      value={editFormData.specialNeeds || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter special needs"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="students-modal-footer">
              <button className="students-btn-cancel" onClick={() => setShowEditModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="students-btn-save" onClick={handleUpdateStudent} disabled={updateLoading}>
                <Save size={18} />
                {updateLoading ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="students-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="students-modal-content students-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="students-modal-header">
              <h2>Confirm Deletion</h2>
              <button className="students-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="students-modal-body">
              <div className="students-delete-icon">
                <AlertTriangle size={48} />
              </div>
              <h2>Delete Student?</h2>
              <p>
                You are about to permanently delete{' '}
                <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong>
              </p>
              <p>
                Admission Number: <strong>{selectedStudent?.admissionNumber}</strong>
              </p>
              <p className="students-warning-text">
                ⚠️ This action cannot be undone. All student data will be permanently removed.
              </p>
            </div>

            <div className="students-modal-footer">
              <button className="students-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="students-btn-delete-confirm" onClick={handleDeleteStudent}>
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

export default ManageStudents
