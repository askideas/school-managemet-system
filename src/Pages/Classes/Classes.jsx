import React, { useState, useEffect } from 'react'
import './Classes.css'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Plus, X, Save, Edit, Trash2, GraduationCap, Hash } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const Classes = () => {
  const [classes, setClasses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  
  const [formData, setFormData] = useState({
    className: '',
    classId: ''
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Classes'))
      const classesData = []
      querySnapshot.forEach((doc) => {
        classesData.push({ id: doc.id, ...doc.data() })
      })
      // Sort by classId
      classesData.sort((a, b) => a.classId.localeCompare(b.classId))
      setClasses(classesData)
    } catch (error) {
      console.error('Error fetching classes:', error)
      showErrorToast('Failed to fetch classes')
    } finally {
      setLoading(false)
    }
  }

  const generateClassId = (className) => {
    if (!className) return ''
    
    // Extract numbers and letters, prioritize numbers for class identification
    const numbers = className.match(/\d+/g)
    const letters = className.match(/[a-zA-Z]+/g)
    
    if (numbers && numbers.length > 0) {
      // For numbered classes like "Class 10", "Grade 5", "10th Standard"
      const classNumber = numbers[0].padStart(2, '0')
      return `CLS${classNumber}`
    } else if (letters && letters.length > 0) {
      // For named classes like "Nursery", "LKG", "UKG", "Kindergarten"
      const firstWord = letters[0].toUpperCase()
      return `CLS${firstWord.substring(0, 3)}`
    } else {
      // Fallback
      return `CLS${Date.now().toString().slice(-3)}`
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'className') {
      const generatedId = generateClassId(value)
      setFormData(prev => ({
        ...prev,
        className: value,
        classId: generatedId
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.className.trim()) {
      showErrorToast('Please enter class name')
      return
    }

    if (!formData.classId.trim()) {
      showErrorToast('Class ID generation failed')
      return
    }

    // Check if class name or ID already exists
    const existingClassByName = classes.find(cls => 
      cls.className.toLowerCase().trim() === formData.className.toLowerCase().trim()
    )
    
    const existingClassById = classes.find(cls => 
      cls.classId === formData.classId
    )
    
    if (existingClassByName) {
      showErrorToast('Class name already exists')
      return
    }

    if (existingClassById) {
      // If ID exists, append timestamp to make it unique
      const uniqueId = `${formData.classId}_${Date.now().toString().slice(-4)}`
      setFormData(prev => ({ ...prev, classId: uniqueId }))
    }

    setSubmitLoading(true)

    try {
      const finalClassId = existingClassById ? 
        `${formData.classId}_${Date.now().toString().slice(-4)}` : 
        formData.classId

      const classData = {
        className: formData.className.trim(),
        classId: finalClassId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        studentsCount: 0,
        subjectsCount: 0
      }

      // Use classId as document ID for easy querying
      await setDoc(doc(db, 'Classes', finalClassId), classData)
      
      showSuccessToast('Class added successfully!')
      
      // Reset form
      setFormData({ className: '', classId: '' })
      setShowAddForm(false)
      
      // Refresh classes list
      await fetchClasses()
    } catch (error) {
      console.error('Error adding class:', error)
      showErrorToast(`Failed to add class: ${error.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (classItem) => {
    setSelectedClass(classItem)
    setShowDeleteModal(true)
  }

  const handleDeleteClass = async () => {
    try {
      // Use the document ID which should be the classId
      await deleteDoc(doc(db, 'Classes', selectedClass.classId))
      showSuccessToast('Class deleted successfully!')
      setShowDeleteModal(false)
      setSelectedClass(null)
      await fetchClasses()
    } catch (error) {
      console.error('Error deleting class:', error)
      showErrorToast('Failed to delete class')
    }
  }

  const handleReset = () => {
    setFormData({ className: '', classId: '' })
  }

  return (
    <div className="classes-container">
      {/* Header Section */}
      <div className="classes-header">
        <div className="header-content">
          <h2>Classes Management</h2>
          <p>Manage school classes and their information</p>
        </div>
        <button 
          className="add-class-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          Add Class
        </button>
      </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="add-class-form-container">
          <div className="form-header">
            <h3>Add New Class</h3>
            <button 
              className="close-form-btn"
              onClick={() => setShowAddForm(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="add-class-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Class Name <span className="required">*</span></label>
                <div className="input-with-icon">
                  <GraduationCap size={18} className="input-icon" />
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="Enter class name (e.g., Class 10, Nursery, LKG)"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Class ID (Auto Generated)</label>
                <div className="input-with-icon">
                  <Hash size={18} className="input-icon" />
                  <input
                    type="text"
                    name="classId"
                    value={formData.classId}
                    readOnly
                    placeholder="Auto generated based on class name"
                    className="readonly-input"
                  />
                </div>
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                  ID is automatically generated from class name
                </small>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-reset" onClick={handleReset}>
                <X size={18} />
                Reset
              </button>
              <button type="submit" className="btn-submit" disabled={submitLoading || !formData.className.trim()}>
                <Save size={18} />
                {submitLoading ? 'Adding...' : 'Add Class'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes List */}
      <div className="classes-list-container">
        <div className="list-header">
          <h3>All Classes</h3>
          <span className="classes-count">{classes.length} Classes</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="empty-state">
            <GraduationCap size={48} />
            <h4>No Classes Found</h4>
            <p>Start by adding your first class</p>
            <button 
              className="add-first-class-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Add First Class
            </button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((classItem) => (
              <div key={classItem.id} className="class-card">
                <div className="class-card-header">
                  <div className="class-icon">
                    <GraduationCap size={24} />
                  </div>
                  <div className="class-actions">
                    <button className="action-btn edit-btn" title="Edit Class">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Delete Class"
                      onClick={() => handleDeleteClick(classItem)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="class-card-body">
                  <h4 className="class-name">{classItem.className}</h4>
                  <p className="class-id">ID: {classItem.classId}</p>
                  <div className="class-stats">
                    <div className="stat-item">
                      <span className="stat-label">Students</span>
                      <span className="stat-value">0</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Subjects</span>
                      <span className="stat-value">0</span>
                    </div>
                  </div>
                  <div className="class-status">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Class</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Class?</h3>
              <p>
                Are you sure you want to delete class{' '}
                <strong>{selectedClass?.className}</strong>?
              </p>
              <p className="warning-text">
                ⚠️ This action cannot be undone. All related data will be removed.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleDeleteClass}>
                <Trash2 size={18} />
                Delete Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Classes