import React, { useState, useEffect } from 'react'
import './Subjects.css'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Plus, X, Save, Edit, Trash2, BookOpen, Hash, GraduationCap } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    classId: '',
    className: '',
    subjectType: '',
    description: ''
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

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

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Subjects'))
      const subjectsData = []
      querySnapshot.forEach((doc) => {
        subjectsData.push({ id: doc.id, ...doc.data() })
      })
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Error fetching subjects:', error)
      showErrorToast('Failed to fetch subjects')
    } finally {
      setLoading(false)
    }
  }

  const generateSubjectCode = (subjectName, classId) => {
    if (!subjectName || !classId) return ''
    const cleanSubject = subjectName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const subjectPrefix = cleanSubject.substring(0, 3)
    return `${classId}_${subjectPrefix}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'classId') {
      const selectedClass = classes.find(cls => cls.classId === value)
      setFormData(prev => ({
        ...prev,
        classId: value,
        className: selectedClass ? selectedClass.className : '',
        subjectCode: generateSubjectCode(prev.subjectName, value)
      }))
    } else if (name === 'subjectName') {
      setFormData(prev => ({
        ...prev,
        subjectName: value,
        subjectCode: generateSubjectCode(value, prev.classId)
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
    
    if (!formData.subjectName.trim()) {
      showErrorToast('Please enter subject name')
      return
    }

    if (!formData.classId) {
      showErrorToast('Please select a class')
      return
    }

    if (!formData.subjectType) {
      showErrorToast('Please select subject type')
      return
    }

    // Check if subject already exists
    const existingSubject = subjects.find(subject => 
      subject.subjectCode === formData.subjectCode ||
      (subject.subjectName.toLowerCase() === formData.subjectName.toLowerCase() && 
       subject.classId === formData.classId)
    )
    
    if (existingSubject) {
      showErrorToast('Subject already exists for this class')
      return
    }

    setSubmitLoading(true)

    try {
      const subjectData = {
        subjectName: formData.subjectName.trim(),
        subjectCode: formData.subjectCode,
        classId: formData.classId,
        className: formData.className,
        subjectType: formData.subjectType,
        description: formData.description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        studentsCount: 0
      }

      await setDoc(doc(db, 'Subjects', formData.subjectCode), subjectData)
      
      showSuccessToast('Subject added successfully!')
      setFormData({ 
        subjectName: '', 
        subjectCode: '', 
        classId: '', 
        className: '', 
        subjectType: '', 
        description: '' 
      })
      setShowAddForm(false)
      await fetchSubjects()
    } catch (error) {
      console.error('Error adding subject:', error)
      showErrorToast(`Failed to add subject: ${error.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject)
    setShowDeleteModal(true)
  }

  const handleDeleteSubject = async () => {
    try {
      await deleteDoc(doc(db, 'Subjects', selectedSubject.subjectCode))
      showSuccessToast('Subject deleted successfully!')
      setShowDeleteModal(false)
      setSelectedSubject(null)
      await fetchSubjects()
    } catch (error) {
      console.error('Error deleting subject:', error)
      showErrorToast('Failed to delete subject')
    }
  }

  const handleReset = () => {
    setFormData({ 
      subjectName: '', 
      subjectCode: '', 
      classId: '', 
      className: '', 
      subjectType: '', 
      description: '' 
    })
  }

  return (
    <div className="subjects-container">
      {/* Header Section */}
      <div className="subjects-header">
        <div className="subjects-header-content">
          <h2>Subjects Management</h2>
          <p>Manage school subjects and their information</p>
        </div>
        <button 
          className="subjects-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <div className="subjects-form-container">
          <div className="subjects-form-header">
            <h3>Add New Subject</h3>
            <button 
              className="subjects-close-btn"
              onClick={() => setShowAddForm(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="subjects-form">
            <div className="subjects-form-grid">
              <div className="subjects-form-group">
                <label>Subject Name <span className="subjects-required">*</span></label>
                <div className="subjects-input-with-icon">
                  <BookOpen size={18} className="subjects-input-icon" />
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    placeholder="Enter subject name (e.g., Mathematics, Science)"
                    required
                  />
                </div>
              </div>

              <div className="subjects-form-group">
                <label>Select Class <span className="subjects-required">*</span></label>
                <div className="subjects-input-with-icon">
                  <GraduationCap size={18} className="subjects-input-icon" />
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((classItem) => (
                      <option key={classItem.classId} value={classItem.classId}>
                        {classItem.className} ({classItem.classId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="subjects-form-group">
                <label>Subject Type <span className="subjects-required">*</span></label>
                <select
                  name="subjectType"
                  value={formData.subjectType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subject Type</option>
                  <option value="Core">Core Subject</option>
                  <option value="Elective">Elective Subject</option>
                  <option value="Language">Language</option>
                  <option value="Sports">Sports & Physical Education</option>
                  <option value="Arts">Arts & Crafts</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="subjects-form-group">
                <label>Subject Code (Auto Generated)</label>
                <div className="subjects-input-with-icon">
                  <Hash size={18} className="subjects-input-icon" />
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    readOnly
                    placeholder="Auto generated based on class and subject"
                    className="subjects-readonly-input"
                  />
                </div>
              </div>

              <div className="subjects-form-group subjects-full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter subject description (optional)"
                  rows="3"
                  className="subjects-textarea"
                />
              </div>
            </div>

            <div className="subjects-form-actions">
              <button type="button" className="subjects-btn-reset" onClick={handleReset}>
                <X size={18} />
                Reset
              </button>
              <button type="submit" className="subjects-btn-submit" disabled={submitLoading || !formData.classId || !formData.subjectName.trim() || !formData.subjectType}>
                <Save size={18} />
                {submitLoading ? 'Adding...' : 'Add Subject'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subjects List */}
      <div className="subjects-list-container">
        <div className="subjects-list-header">
          <h3>All Subjects</h3>
          <span className="subjects-count">{subjects.length} Subjects</span>
        </div>

        {loading ? (
          <div className="subjects-loading-state">
            <div className="subjects-loading-spinner"></div>
            <p>Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="subjects-empty-state">
            <BookOpen size={48} />
            <h4>No Subjects Found</h4>
            <p>Start by adding your first subject</p>
            <button 
              className="subjects-add-first-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Add First Subject
            </button>
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div key={subject.id} className="subjects-card">
                <div className="subjects-card-header">
                  <div className="subjects-card-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="subjects-card-actions">
                    <button className="subjects-action-btn subjects-edit-btn" title="Edit Subject">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="subjects-action-btn subjects-delete-btn" 
                      title="Delete Subject"
                      onClick={() => handleDeleteClick(subject)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="subjects-card-body">
                  <h4 className="subjects-card-name">{subject.subjectName}</h4>
                  <p className="subjects-card-class">{subject.className}</p>
                  <p className="subjects-card-code">Code: {subject.subjectCode}</p>
                  <div className="subjects-card-type">
                    <span className={`subjects-type-badge subjects-${subject.subjectType.toLowerCase()}`}>
                      {subject.subjectType}
                    </span>
                  </div>
                  <div className="subjects-card-stats">
                    <div className="subjects-stat-item">
                      <span className="subjects-stat-label">Students</span>
                      <span className="subjects-stat-value">{subject.studentsCount || 0}</span>
                    </div>
                  </div>
                  {subject.description && (
                    <p className="subjects-card-description">{subject.description}</p>
                  )}
                  <div className="subjects-card-status">
                    <span className="subjects-status-badge subjects-active">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="subjects-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="subjects-modal-content subjects-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="subjects-modal-header">
              <h2>Delete Subject</h2>
              <button className="subjects-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="subjects-modal-body">
              <div className="subjects-delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Subject?</h3>
              <p>
                Are you sure you want to delete subject{' '}
                <strong>{selectedSubject?.subjectName}</strong> for class{' '}
                <strong>{selectedSubject?.className}</strong>?
              </p>
              <p className="subjects-warning-text">
                ⚠️ This action cannot be undone. All related data will be removed.
              </p>
            </div>

            <div className="subjects-modal-footer">
              <button className="subjects-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="subjects-btn-delete-confirm" onClick={handleDeleteSubject}>
                <Trash2 size={18} />
                Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subjects