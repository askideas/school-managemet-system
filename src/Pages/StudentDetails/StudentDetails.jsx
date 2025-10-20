import React, { useState, useEffect } from 'react'
import './StudentDetails.css'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, getDocs, setDoc, addDoc } from 'firebase/firestore'
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
  AlertCircle
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
    installments: 1,
    dueDate: '',
    description: ''
  })
  const [paymentLoading, setPaymentLoading] = useState(false)

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
      const installmentAmount = Math.ceil(parseFloat(paymentPlan.totalFee) / parseInt(paymentPlan.installments))

      const paymentPlanDoc = {
        studentId,
        studentClassId: selectedStudentClass,
        className: studentClass.className,
        sectionName: studentClass.sectionName,
        totalFee: parseFloat(paymentPlan.totalFee),
        installments: parseInt(paymentPlan.installments),
        installmentAmount,
        dueDate: paymentPlan.dueDate,
        description: paymentPlan.description,
        status: 'active',
        paidAmount: 0,
        pendingAmount: parseFloat(paymentPlan.totalFee),
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'PaymentPlans'), paymentPlanDoc)
      
      setPaymentPlan({
        totalFee: '',
        installments: 1,
        dueDate: '',
        description: ''
      })
      setSelectedStudentClass('')
      showSuccessToast('Payment plan created successfully!')
      
      await fetchPaymentPlans()
      await addActivity('payment_plan_created', `Payment plan created for ${studentClass.className}`, {
        totalFee: parseFloat(paymentPlan.totalFee),
        installments: parseInt(paymentPlan.installments),
        className: studentClass.className
      })
    } catch (error) {
      console.error('Error creating payment plan:', error)
      showErrorToast('Failed to create payment plan')
    } finally {
      setPaymentLoading(false)
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
        return <Edit size={16} className="students-activity-icon-edit" />
      case 'class_enrollment':
        return <School size={16} className="students-activity-icon-class" />
      case 'payment_plan_created':
        return <CreditCard size={16} className="students-activity-icon-payment" />
      default:
        return <Activity size={16} className="students-activity-icon-default" />
    }
  }

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
                  <label>Total Fee (₹)</label>
                  <input
                    type="number"
                    value={paymentPlan.totalFee}
                    onChange={(e) => setPaymentPlan({...paymentPlan, totalFee: e.target.value})}
                    placeholder="Enter total fee"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Installments</label>
                  <select
                    value={paymentPlan.installments}
                    onChange={(e) => setPaymentPlan({...paymentPlan, installments: e.target.value})}
                  >
                    <option value="1">1 Installment</option>
                    <option value="2">2 Installments</option>
                    <option value="3">3 Installments</option>
                    <option value="4">4 Installments</option>
                    <option value="6">6 Installments</option>
                    <option value="12">12 Installments</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={paymentPlan.dueDate}
                    onChange={(e) => setPaymentPlan({...paymentPlan, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={paymentPlan.description}
                    onChange={(e) => setPaymentPlan({...paymentPlan, description: e.target.value})}
                    placeholder="Payment plan description"
                    rows="3"
                  />
                </div>
                <button 
                  className="create-payment-btn"
                  onClick={handleCreatePaymentPlan}
                  disabled={!selectedStudentClass || !paymentPlan.totalFee || paymentLoading}
                >
                  <Plus size={18} />
                  {paymentLoading ? 'Creating...' : 'Create Payment Plan'}
                </button>
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
                        <div className="payment-icon">
                          <DollarSign size={24} />
                        </div>
                        <span className={`payment-status ${plan.status}`}>
                          {plan.status}
                        </span>
                      </div>
                      <div className="payment-card-body">
                        <h4>{plan.className} - Section {plan.sectionName}</h4>
                        <div className="payment-details">
                          <div className="payment-detail">
                            <span className="label">Total Fee:</span>
                            <span className="value">{formatCurrency(plan.totalFee)}</span>
                          </div>
                          <div className="payment-detail">
                            <span className="label">Installments:</span>
                            <span className="value">{plan.installments}</span>
                          </div>
                          <div className="payment-detail">
                            <span className="label">Per Installment:</span>
                            <span className="value">{formatCurrency(plan.installmentAmount)}</span>
                          </div>
                          <div className="payment-detail">
                            <span className="label">Paid Amount:</span>
                            <span className="value paid">{formatCurrency(plan.paidAmount)}</span>
                          </div>
                          <div className="payment-detail">
                            <span className="label">Pending Amount:</span>
                            <span className="value pending">{formatCurrency(plan.pendingAmount)}</span>
                          </div>
                          {plan.dueDate && (
                            <div className="payment-detail">
                              <span className="label">Due Date:</span>
                              <span className="value">{formatDate(plan.dueDate)}</span>
                            </div>
                          )}
                        </div>
                        {plan.description && (
                          <p className="payment-description">{plan.description}</p>
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
            </div>

            <div className="activity-timeline">
              {activities.length === 0 ? (
                <div className="empty-state">
                  <Activity size={48} />
                  <p>No activities recorded yet</p>
                </div>
              ) : (
                <div className="timeline">
                  {activities.map((activity) => (
                    <div key={activity.id} className="timeline-item">
                      <div className="timeline-marker">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="timeline-content">
                        <div className="activity-header">
                          <h4>{activity.description}</h4>
                          <span className="activity-time">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {activity.details && (
                          <div className="activity-details">
                            {Object.entries(activity.details).map(([key, value]) => (
                              <div key={key} className="detail-item">
                                <span className="detail-key">{key}:</span>
                                <span className="detail-value">{value}</span>
                              </div>
                            ))}
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
      </div>
    </div>
  )
}

export default StudentDetails
