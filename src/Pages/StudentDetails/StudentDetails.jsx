import React, { useState, useEffect } from 'react'
import './StudentDetails.css'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Plus, 
  CreditCard, 
  Activity,
  School,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const StudentDetails = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  
  const [student, setStudent] = useState(null)
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const [paymentPlans, setPaymentPlans] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({})

  // Class tab states
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [classLoading, setClassLoading] = useState(false)

  // Payment tab states
  const [selectedStudentClass, setSelectedStudentClass] = useState('')
  const [paymentPlan, setPaymentPlan] = useState({
    totalFee: '',
    description: ''
  })
  const [paymentLoading, setPaymentLoading] = useState(false)
  
  // New states for installment management
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  const [selectedPlanForInstallment, setSelectedPlanForInstallment] = useState(null)
  const [installmentData, setInstallmentData] = useState({
    amount: '',
    paymentMode: '',
    comment: '',
    paymentDate: new Date().toISOString().split('T')[0]
  })
  const [installmentLoading, setInstallmentLoading] = useState(false)

  // New states for edit and delete functionality
  const [editingPlan, setEditingPlan] = useState(null)
  const [editPlanData, setEditPlanData] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [planToDelete, setPlanToDelete] = useState(null)
  const [editPlanLoading, setEditPlanLoading] = useState(false)

  // New states for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  useEffect(() => {
    if (studentId) {
      fetchStudentData()
      fetchClasses()
      fetchSections()
      fetchStudentClasses()
      fetchPaymentPlans()
      fetchActivities()
    }
  }, [studentId])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      const studentDoc = await getDoc(doc(db, 'Students', studentId))
      if (studentDoc.exists()) {
        const studentData = { id: studentDoc.id, ...studentDoc.data() }
        setStudent(studentData)
        setEditFormData(studentData)
      } else {
        showErrorToast('Student not found')
        navigate('/students')
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      showErrorToast('Failed to fetch student details')
    } finally {
      setLoading(false)
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

  const fetchStudentClasses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'StudentClasses'))
      const studentClassesData = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.studentId === studentId) {
          studentClassesData.push({ id: doc.id, ...data })
        }
      })
      setStudentClasses(studentClassesData)
    } catch (error) {
      console.error('Error fetching student classes:', error)
    }
  }

  const fetchPaymentPlans = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'PaymentPlans'))
      const paymentPlansData = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.studentId === studentId) {
          paymentPlansData.push({ id: doc.id, ...data })
        }
      })
      setPaymentPlans(paymentPlansData)
    } catch (error) {
      console.error('Error fetching payment plans:', error)
    }
  }

  const fetchActivities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'StudentActivities'))
      const activitiesData = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.studentId === studentId) {
          activitiesData.push({ id: doc.id, ...data })
        }
      })
      setActivities(activitiesData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  const addActivity = async (type, description, details = {}) => {
    try {
      await addDoc(collection(db, 'StudentActivities'), {
        studentId,
        type,
        description,
        details,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
      fetchActivities()
    } catch (error) {
      console.error('Error adding activity:', error)
    }
  }

  const handleEditSubmit = async () => {
    try {
      setLoading(true)
      await updateDoc(doc(db, 'Students', studentId), {
        ...editFormData,
        updatedAt: new Date().toISOString()
      })
      
      setStudent({ ...student, ...editFormData })
      setIsEditing(false)
      showSuccessToast('Student updated successfully!')
      
      await addActivity('profile_update', 'Student profile was updated', {
        updatedFields: Object.keys(editFormData)
      })
    } catch (error) {
      console.error('Error updating student:', error)
      showErrorToast('Failed to update student')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClass = async () => {
    if (!selectedClass || !selectedSection) {
      showErrorToast('Please select both class and section')
      return
    }

    try {
      setClassLoading(true)
      const classData = classes.find(c => c.classId === selectedClass)
      const sectionData = sections.find(s => s.sectionId === selectedSection)

      const studentClassDoc = {
        studentId,
        classId: selectedClass,
        className: classData.className,
        sectionId: selectedSection,
        sectionName: sectionData.sectionName,
        enrollmentDate: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'StudentClasses', `${studentId}_${selectedClass}_${selectedSection}`), studentClassDoc)
      
      setSelectedClass('')
      setSelectedSection('')
      showSuccessToast('Class added successfully!')
      
      await fetchStudentClasses()
      await addActivity('class_enrollment', `Enrolled in ${classData.className} - Section ${sectionData.sectionName}`, {
        classId: selectedClass,
        className: classData.className,
        sectionId: selectedSection,
        sectionName: sectionData.sectionName
      })
    } catch (error) {
      console.error('Error adding class:', error)
      showErrorToast('Failed to add class')
    } finally {
      setClassLoading(false)
    }
  }

  const handleCreatePaymentPlan = async () => {
    if (!selectedStudentClass || !paymentPlan.totalFee) {
      showErrorToast('Please select class and enter total fee')
      return
    }

    try {
      setPaymentLoading(true)
      const studentClass = studentClasses.find(sc => sc.id === selectedStudentClass)

      const paymentPlanDoc = {
        studentId,
        studentClassId: selectedStudentClass,
        className: studentClass.className,
        sectionName: studentClass.sectionName,
        totalFee: parseFloat(paymentPlan.totalFee),
        description: paymentPlan.description,
        status: 'active',
        paidAmount: 0,
        pendingAmount: parseFloat(paymentPlan.totalFee),
        installments: [],
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'PaymentPlans'), paymentPlanDoc)
      
      setPaymentPlan({
        totalFee: '',
        description: ''
      })
      setSelectedStudentClass('')
      showSuccessToast('Payment plan created successfully!')
      
      await fetchPaymentPlans()
      await addActivity('payment_plan_created', `Payment plan created for ${studentClass.className}`, {
        totalFee: parseFloat(paymentPlan.totalFee),
        className: studentClass.className
      })
    } catch (error) {
      console.error('Error creating payment plan:', error)
      showErrorToast('Failed to create payment plan')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleAddInstallment = (plan) => {
    setSelectedPlanForInstallment(plan)
    setInstallmentData({
      amount: '',
      paymentMode: '',
      comment: '',
      paymentDate: new Date().toISOString().split('T')[0]
    })
    setShowInstallmentModal(true)
  }

  const handleInstallmentSubmit = async () => {
    if (!installmentData.amount || !installmentData.paymentMode) {
      showErrorToast('Please fill all required fields')
      return
    }

    if (parseFloat(installmentData.amount) > selectedPlanForInstallment.pendingAmount) {
      showErrorToast('Payment amount cannot exceed pending amount')
      return
    }

    try {
      setInstallmentLoading(true)
      
      const newInstallment = {
        id: Date.now().toString(),
        amount: parseFloat(installmentData.amount),
        paymentMode: installmentData.paymentMode,
        comment: installmentData.comment,
        paymentDate: installmentData.paymentDate,
        createdAt: new Date().toISOString()
      }

      const updatedInstallments = [...(selectedPlanForInstallment.installments || []), newInstallment]
      const newPaidAmount = selectedPlanForInstallment.paidAmount + parseFloat(installmentData.amount)
      const newPendingAmount = selectedPlanForInstallment.totalFee - newPaidAmount

      await updateDoc(doc(db, 'PaymentPlans', selectedPlanForInstallment.id), {
        installments: updatedInstallments,
        paidAmount: newPaidAmount,
        pendingAmount: newPendingAmount,
        status: newPendingAmount === 0 ? 'completed' : 'active',
        updatedAt: new Date().toISOString()
      })

      setShowInstallmentModal(false)
      setSelectedPlanForInstallment(null)
      showSuccessToast('Installment added successfully!')
      
      await fetchPaymentPlans()
      await addActivity('installment_added', `Installment payment of ${formatCurrency(parseFloat(installmentData.amount))} added`, {
        planId: selectedPlanForInstallment.id,
        amount: parseFloat(installmentData.amount),
        paymentMode: installmentData.paymentMode,
        className: selectedPlanForInstallment.className
      })
    } catch (error) {
      console.error('Error adding installment:', error)
      showErrorToast('Failed to add installment')
    } finally {
      setInstallmentLoading(false)
    }
  }

  // Remove old edit/delete plan functions and replace with simplified ones
  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan)
    setShowDeleteModal(true)
  }

  const handleDeletePlan = async () => {
    try {
      await deleteDoc(doc(db, 'PaymentPlans', planToDelete.id))
      
      setShowDeleteModal(false)
      setPlanToDelete(null)
      showSuccessToast('Payment plan deleted successfully!')
      
      await fetchPaymentPlans()
      await addActivity('payment_plan_deleted', `Payment plan deleted for ${planToDelete.className}`, {
        planId: planToDelete.id,
        className: planToDelete.className
      })
    } catch (error) {
      console.error('Error deleting payment plan:', error)
      showErrorToast('Failed to delete payment plan')
    }
  }

  const getAvailableSections = () => {
    if (!selectedClass) return []
    return sections.filter(section => section.classId === selectedClass)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'profile_update':
        return <Edit size={18} className="students-activity-icon-edit" />
      case 'class_enrollment':
        return <School size={18} className="students-activity-icon-class" />
      case 'payment_plan_created':
        return <CreditCard size={18} className="students-activity-icon-payment" />
      case 'payment_plan_updated':
        return <Edit size={18} className="students-activity-icon-payment" />
      case 'payment_plan_deleted':
        return <Trash2 size={18} className="students-activity-icon-edit" />
      case 'installment_added':
        return <DollarSign size={18} className="students-activity-icon-payment" />
      default:
        return <Activity size={18} className="students-activity-icon-default" />
    }
  }

  // Add pagination logic
  const getPaginatedActivities = () => {
    const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedActivities.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(activities.length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getPageNumbers = () => {
    const totalPages = getTotalPages()
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    
    return pages
  }

  // Reset pagination when activities change
  useEffect(() => {
    setCurrentPage(1)
  }, [activities])

  if (loading && !student) {
    return (
      <div className="students-loading-container">
        <div className="students-loading-spinner"></div>
        <p>Loading student details...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="students-error-container">
        <p>Student not found</p>
        <button onClick={() => navigate('/students')} className="students-back-btn">
          <ArrowLeft size={18} />
          Back to Students
        </button>
      </div>
    )
  }

  return (
    <div className="student-details-container">
      {/* Header */}
      <div className="student-details-header">
        <button onClick={() => navigate('/students')} className="students-back-btn">
          <ArrowLeft size={18} />
          Back to Students
        </button>
        <div className="student-details-title">
          <h1>{`${student.firstName} ${student.lastName}`}</h1>
          <p>Admission No: {student.admissionNumber}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="student-details-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'class' ? 'active' : ''}`}
          onClick={() => setActiveTab('class')}
        >
          <GraduationCap size={18} />
          Class
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          <CreditCard size={18} />
          Payment
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Activity size={18} />
          Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="student-details-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-header">
              <h2>Student Profile</h2>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => {
                    setIsEditing(false)
                    setEditFormData(student)
                  }}>
                    <X size={18} />
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleEditSubmit}>
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="profile-content">
              {/* Profile Photo Section */}
              <div className="profile-photo-section">
                <div className="profile-photo">
                  {student.profileImage ? (
                    <img src={student.profileImage} alt="Student" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <div className="profile-basic-info">
                  <h3>{`${student.firstName} ${student.lastName}`}</h3>
                  <p>{student.admissionNumber}</p>
                  <p>{student.className} - Section {student.sectionName}</p>
                </div>
              </div>

              {/* Profile Information Grid */}
              <div className="profile-grid">
                {/* Personal Information */}
                <div className="profile-section">
                  <h4>Personal Information</h4>
                  <div className="profile-fields">
                    <div className="field-group">
                      <label>First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.firstName || ''}
                          onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                        />
                      ) : (
                        <span>{student.firstName}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.lastName || ''}
                          onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                        />
                      ) : (
                        <span>{student.lastName}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editFormData.dateOfBirth || ''}
                          onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})}
                        />
                      ) : (
                        <span>{formatDate(student.dateOfBirth)}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Gender</label>
                      {isEditing ? (
                        <select
                          value={editFormData.gender || ''}
                          onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <span>{student.gender || 'Not specified'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Blood Group</label>
                      {isEditing ? (
                        <select
                          value={editFormData.bloodGroup || ''}
                          onChange={(e) => setEditFormData({...editFormData, bloodGroup: e.target.value})}
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
                      ) : (
                        <span>{student.bloodGroup || 'Not specified'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="profile-section">
                  <h4>Contact Information</h4>
                  <div className="profile-fields">
                    <div className="field-group">
                      <label>Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        />
                      ) : (
                        <span>{student.email || 'Not provided'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Mobile</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editFormData.mobile || ''}
                          onChange={(e) => setEditFormData({...editFormData, mobile: e.target.value})}
                          maxLength="10"
                        />
                      ) : (
                        <span>{student.mobile || 'Not provided'}</span>
                      )}
                    </div>
                    <div className="field-group full-width">
                      <label>Address</label>
                      {isEditing ? (
                        <textarea
                          value={editFormData.address || ''}
                          onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                          rows="3"
                        />
                      ) : (
                        <span>{student.address || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="profile-section">
                  <h4>Parent Information</h4>
                  <div className="profile-fields">
                    <div className="field-group">
                      <label>Father's Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.fatherName || ''}
                          onChange={(e) => setEditFormData({...editFormData, fatherName: e.target.value})}
                        />
                      ) : (
                        <span>{student.fatherName || 'Not provided'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Father's Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editFormData.fatherPhone || ''}
                          onChange={(e) => setEditFormData({...editFormData, fatherPhone: e.target.value})}
                          maxLength="10"
                        />
                      ) : (
                        <span>{student.fatherPhone || 'Not provided'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Mother's Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.motherName || ''}
                          onChange={(e) => setEditFormData({...editFormData, motherName: e.target.value})}
                        />
                      ) : (
                        <span>{student.motherName || 'Not provided'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Mother's Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editFormData.motherPhone || ''}
                          onChange={(e) => setEditFormData({...editFormData, motherPhone: e.target.value})}
                          maxLength="10"
                        />
                      ) : (
                        <span>{student.motherPhone || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Class Tab */}
        {activeTab === 'class' && (
          <div className="class-tab">
            <div className="class-header">
              <h2>Class Management</h2>
            </div>

            {/* Add New Class */}
            <div className="add-class-section">
              <h3>Add New Class</h3>
              <div className="add-class-form">
                <div className="form-group">
                  <label>Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Choose Class</option>
                    {classes.map((classItem) => (
                      <option key={classItem.classId} value={classItem.classId}>
                        {classItem.className}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Select Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">Choose Section</option>
                    {getAvailableSections().map((section) => (
                      <option key={section.sectionId} value={section.sectionId}>
                        Section {section.sectionName}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  className="add-class-btn"
                  onClick={handleAddClass}
                  disabled={!selectedClass || !selectedSection || classLoading}
                >
                  <Plus size={18} />
                  {classLoading ? 'Adding...' : 'Add Class'}
                </button>
              </div>
            </div>

            {/* Student Classes List */}
            <div className="student-classes-section">
              <h3>Enrolled Classes</h3>
              {studentClasses.length === 0 ? (
                <div className="empty-state">
                  <School size={48} />
                  <p>No classes enrolled yet</p>
                </div>
              ) : (
                <div className="classes-grid">
                  {studentClasses.map((studentClass) => (
                    <div key={studentClass.id} className="class-card">
                      <div className="class-card-header">
                        <div className="class-icon">
                          <GraduationCap size={24} />
                        </div>
                        <span className="class-status active">Active</span>
                      </div>
                      <div className="class-card-body">
                        <h4>{studentClass.className}</h4>
                        <p>Section {studentClass.sectionName}</p>
                        <p className="enrollment-date">
                          Enrolled: {formatDate(studentClass.enrollmentDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="payment-tab">
            <div className="payment-header">
              <h2>Payment Management</h2>
            </div>

            {/* Create Payment Plan */}
            <div className="create-payment-section">
              <h3>Create Payment Plan</h3>
              <div className="payment-form">
                <div className="form-group">
                  <label>Select Class</label>
                  <select
                    value={selectedStudentClass}
                    onChange={(e) => setSelectedStudentClass(e.target.value)}
                  >
                    <option value="">Choose Class</option>
                    {studentClasses.map((studentClass) => (
                      <option key={studentClass.id} value={studentClass.id}>
                        {studentClass.className} - Section {studentClass.sectionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Total Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentPlan.totalFee}
                    onChange={(e) => setPaymentPlan({...paymentPlan, totalFee: e.target.value})}
                    placeholder="Enter total amount"
                    min="0"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    value={paymentPlan.description}
                    onChange={(e) => setPaymentPlan({...paymentPlan, description: e.target.value})}
                    placeholder="Payment description"
                  />
                </div>
                <div className="payment-form-actions">
                  <button 
                    className="create-payment-btn"
                    onClick={handleCreatePaymentPlan}
                    disabled={!selectedStudentClass || !paymentPlan.totalFee || paymentLoading}
                  >
                    <Plus size={18} />
                    {paymentLoading ? 'Creating...' : 'Add Payment Plan'}
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Plans List */}
            <div className="payment-plans-section">
              <h3>Payment Plans</h3>
              {paymentPlans.length === 0 ? (
                <div className="empty-state">
                  <CreditCard size={48} />
                  <p>No payment plans created yet</p>
                </div>
              ) : (
                <div className="payment-plans-grid">
                  {paymentPlans.map((plan) => (
                    <div key={plan.id} className="payment-plan-card">
                      <div className="payment-card-header">
                        <div className="payment-header-left">
                          <div className="payment-icon">
                            <DollarSign size={24} />
                          </div>
                          <div className="payment-title-section">
                            <h4>{plan.className} - Section {plan.sectionName}</h4>
                            <span className={`payment-status ${plan.status}`}>
                              {plan.status}
                            </span>
                          </div>
                        </div>
                        <div className="payment-card-actions">
                          <button 
                            className="payment-add-installment-btn"
                            onClick={() => handleAddInstallment(plan)}
                            title="Add Installment"
                            disabled={plan.pendingAmount === 0}
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            className="payment-delete-btn"
                            onClick={() => handleDeleteClick(plan)}
                            title="Delete Payment Plan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="payment-card-body">
                        <div className="payment-summary">
                          <div className="payment-summary-item">
                            <span className="label">Total Amount:</span>
                            <span className="value total">{formatCurrency(plan.totalFee)}</span>
                          </div>
                          <div className="payment-summary-item">
                            <span className="label">Paid Amount:</span>
                            <span className="value paid">{formatCurrency(plan.paidAmount || 0)}</span>
                          </div>
                          <div className="payment-summary-item">
                            <span className="label">Pending Amount:</span>
                            <span className="value pending">{formatCurrency(plan.pendingAmount)}</span>
                          </div>
                        </div>

                        {plan.description && (
                          <div className="payment-description">
                            <p>{plan.description}</p>
                          </div>
                        )}

                        {/* Installments List */}
                        {plan.installments && plan.installments.length > 0 && (
                          <div className="installments-section">
                            <h5>Payment History ({plan.installments.length} payments)</h5>
                            <div className="installments-list">
                              {plan.installments.map((installment, index) => (
                                <div key={installment.id} className="installment-item">
                                  <div className="installment-header">
                                    <div className="installment-left">
                                      <span className="installment-number">#{index + 1}</span>
                                      <span className="installment-amount">{formatCurrency(installment.amount)}</span>
                                    </div>
                                    <span className="installment-date">{formatDate(installment.paymentDate)}</span>
                                  </div>
                                  <div className="installment-details">
                                    <div className="installment-detail-row">
                                      <span className="payment-mode">Mode: {installment.paymentMode}</span>
                                      {installment.comment && (
                                        <span className="installment-comment">Note: {installment.comment}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="activity-tab">
            <div className="activity-header">
              <h2>Student Activity Log</h2>
              {activities.length > 0 && (
                <div className="activity-stats">
                  <span className="activity-count">
                    {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'}
                  </span>
                  <span className="page-indicator">
                    Page {currentPage} of {getTotalPages()}
                  </span>
                </div>
              )}
            </div>

            <div className="activity-timeline">
              {activities.length === 0 ? (
                <div className="empty-state">
                  <Activity size={64} />
                  <h4>No Activities Found</h4>
                  <p>Student activities will appear here as they are recorded</p>
                </div>
              ) : (
                <>
                  <div className="timeline">
                    {getPaginatedActivities().map((activity) => (
                      <div key={activity.id} className="timeline-item">
                        <div className="timeline-marker">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="timeline-content">
                          <div className="activity-header">
                            <h4>{activity.description}</h4>
                            <span className="activity-time">
                              {new Date(activity.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {activity.details && Object.keys(activity.details).length > 0 && (
                            <div className="activity-details">
                              {Object.entries(activity.details).map(([key, value]) => (
                                <div key={key} className="detail-item">
                                  <span className="detail-key">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                  <span className="detail-value">
                                    {typeof value === 'string' && value.startsWith('₹') ? value : 
                                     typeof value === 'number' && key.toLowerCase().includes('fee') ? formatCurrency(value) :
                                     String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {getTotalPages() > 1 && (
                    <div className="activity-pagination">
                      <div className="pagination-container">
                        <button 
                          className="pagination-btn pagination-prev"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={18} />
                          Previous
                        </button>

                        <div className="pagination-numbers">
                          {getPageNumbers().map((page) => (
                            <button
                              key={page}
                              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button 
                          className="pagination-btn pagination-next"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === getTotalPages()}
                        >
                          Next
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="pagination-info">
                        <span>
                          Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, activities.length)} of{' '}
                          {activities.length} activities
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Payment Plan Modal */}
      {showDeleteModal && planToDelete && (
        <div className="payment-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="payment-modal-content payment-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h2>Delete Payment Plan</h2>
              <button className="payment-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="payment-modal-body">
              <div className="payment-delete-icon">
                <AlertTriangle size={48} />
              </div>
              <h3>Delete Payment Plan?</h3>
              <p>
                Are you sure you want to delete the payment plan for{' '}
                <strong>{planToDelete.className} - Section {planToDelete.sectionName}</strong>?
              </p>
              <p>
                Total Fee: <strong>{formatCurrency(planToDelete.totalFee)}</strong>
              </p>
              <p className="payment-warning-text">
                ⚠️ This action cannot be undone. All payment plan data will be permanently removed.
              </p>
            </div>

            <div className="payment-modal-footer">
              <button className="payment-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="payment-btn-delete-confirm" onClick={handleDeletePlan}>
                <Trash2 size={18} />
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Installment Modal */}
      {showInstallmentModal && selectedPlanForInstallment && (
        <div className="payment-modal-overlay" onClick={() => setShowInstallmentModal(false)}>
          <div className="payment-modal-content installment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h2>Add Installment Payment</h2>
              <button className="payment-close-btn" onClick={() => setShowInstallmentModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="payment-modal-body">
              <div className="installment-plan_info">
                <h3>{selectedPlanForInstallment.className} - Section {selectedPlanForInstallment.sectionName}</h3>
                <div className="plan-summary">
                  <div className="summary-item">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(selectedPlanForInstallment.totalFee)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Paid Amount:</span>
                    <span className="paid">{formatCurrency(selectedPlanForInstallment.paidAmount)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Pending Amount:</span>
                    <span className="pending">{formatCurrency(selectedPlanForInstallment.pendingAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="installment-form">
                <div className="installment-form-grid">
                  <div className="form-group">
                    <label>Payment Amount (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      value={installmentData.amount}
                      onChange={(e) => setInstallmentData({...installmentData, amount: e.target.value})}
                      placeholder="Enter payment amount"
                      min="0"
                      max={selectedPlanForInstallment.pendingAmount}
                    />
                  </div>

                  <div className="form-group">
                    <label>Payment Mode <span className="required">*</span></label>
                    <select
                      value={installmentData.paymentMode}
                      onChange={(e) => setInstallmentData({...installmentData, paymentMode: e.target.value})}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Online Transfer">Online Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Card">Card Payment</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Payment Date</label>
                    <input
                      type="date"
                      value={installmentData.paymentDate}
                      onChange={(e) => setInstallmentData({...installmentData, paymentDate: e.target.value})}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Comment</label>
                    <textarea
                      value={installmentData.comment}
                      onChange={(e) => setInstallmentData({...installmentData, comment: e.target.value})}
                      placeholder="Add any comments or notes"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-modal-footer">
              <button className="payment-btn-cancel" onClick={() => setShowInstallmentModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button 
                className="payment-btn-add-installment" 
                onClick={handleInstallmentSubmit}
                disabled={!installmentData.amount || !installmentData.paymentMode || installmentLoading}
              >
                <Plus size={18} />
                {installmentLoading ? 'Adding...' : 'Add Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDetails
