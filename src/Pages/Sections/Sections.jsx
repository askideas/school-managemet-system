import React, { useState, useEffect } from 'react'
import './Sections.css'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Plus, X, Save, Edit, Trash2, Users, Hash, BookOpen } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const Sections = () => {
  const [sections, setSections] = useState([])
  const [classes, setClasses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)
  
  const [formData, setFormData] = useState({
    sectionName: '',
    sectionId: '',
    classId: '',
    className: ''
  })

  useEffect(() => {
    fetchClasses()
    fetchSections()
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

  const fetchSections = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Sections'))
      const sectionsData = []
      querySnapshot.forEach((doc) => {
        sectionsData.push({ id: doc.id, ...doc.data() })
      })
      setSections(sectionsData)
    } catch (error) {
      console.error('Error fetching sections:', error)
      showErrorToast('Failed to fetch sections')
    } finally {
      setLoading(false)
    }
  }

  const generateSectionId = (sectionName, classId) => {
    if (!sectionName || !classId) return ''
    const cleanSection = sectionName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    return `${classId}_SEC${cleanSection}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'classId') {
      const selectedClass = classes.find(cls => cls.classId === value)
      setFormData(prev => ({
        ...prev,
        classId: value,
        className: selectedClass ? selectedClass.className : '',
        sectionId: generateSectionId(prev.sectionName, value)
      }))
    } else if (name === 'sectionName') {
      setFormData(prev => ({
        ...prev,
        sectionName: value,
        sectionId: generateSectionId(value, prev.classId)
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
    
    if (!formData.sectionName.trim()) {
      showErrorToast('Please enter section name')
      return
    }

    if (!formData.classId) {
      showErrorToast('Please select a class')
      return
    }

    // Check if section already exists
    const existingSection = sections.find(section => 
      section.sectionId === formData.sectionId ||
      (section.sectionName.toLowerCase() === formData.sectionName.toLowerCase() && 
       section.classId === formData.classId)
    )
    
    if (existingSection) {
      showErrorToast('Section already exists for this class')
      return
    }

    setSubmitLoading(true)

    try {
      const sectionData = {
        sectionName: formData.sectionName.trim(),
        sectionId: formData.sectionId,
        classId: formData.classId,
        className: formData.className,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        studentsCount: 0
      }

      await setDoc(doc(db, 'Sections', formData.sectionId), sectionData)
      
      showSuccessToast('Section added successfully!')
      setFormData({ sectionName: '', sectionId: '', classId: '', className: '' })
      setShowAddForm(false)
      await fetchSections()
    } catch (error) {
      console.error('Error adding section:', error)
      showErrorToast(`Failed to add section: ${error.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (section) => {
    setSelectedSection(section)
    setShowDeleteModal(true)
  }

  const handleDeleteSection = async () => {
    try {
      await deleteDoc(doc(db, 'Sections', selectedSection.sectionId))
      showSuccessToast('Section deleted successfully!')
      setShowDeleteModal(false)
      setSelectedSection(null)
      await fetchSections()
    } catch (error) {
      console.error('Error deleting section:', error)
      showErrorToast('Failed to delete section')
    }
  }

  const handleReset = () => {
    setFormData({ sectionName: '', sectionId: '', classId: '', className: '' })
  }

  return (
    <div className="sections-container">
      {/* Header Section */}
      <div className="sections-header">
        <div className="sections-header-content">
          <h2>Sections Management</h2>
          <p>Manage class sections and their information</p>
        </div>
        <button 
          className="sections-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          Add Section
        </button>
      </div>

      {/* Add Section Form */}
      {showAddForm && (
        <div className="sections-form-container">
          <div className="sections-form-header">
            <h3>Add New Section</h3>
            <button 
              className="sections-close-btn"
              onClick={() => setShowAddForm(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="sections-form">
            <div className="sections-form-grid">
              <div className="sections-form-group">
                <label>Select Class <span className="sections-required">*</span></label>
                <div className="sections-input-with-icon">
                  <BookOpen size={18} className="sections-input-icon" />
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

              <div className="sections-form-group">
                <label>Section Name <span className="sections-required">*</span></label>
                <div className="sections-input-with-icon">
                  <Users size={18} className="sections-input-icon" />
                  <input
                    type="text"
                    name="sectionName"
                    value={formData.sectionName}
                    onChange={handleInputChange}
                    placeholder="Enter section name (e.g., A, B, Alpha)"
                    required
                  />
                </div>
              </div>

              <div className="sections-form-group">
                <label>Section ID (Auto Generated)</label>
                <div className="sections-input-with-icon">
                  <Hash size={18} className="sections-input-icon" />
                  <input
                    type="text"
                    name="sectionId"
                    value={formData.sectionId}
                    readOnly
                    placeholder="Auto generated based on class and section"
                    className="sections-readonly-input"
                  />
                </div>
              </div>
            </div>

            <div className="sections-form-actions">
              <button type="button" className="sections-btn-reset" onClick={handleReset}>
                <X size={18} />
                Reset
              </button>
              <button type="submit" className="sections-btn-submit" disabled={submitLoading || !formData.classId || !formData.sectionName.trim()}>
                <Save size={18} />
                {submitLoading ? 'Adding...' : 'Add Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sections List */}
      <div className="sections-list-container">
        <div className="sections-list-header">
          <h3>All Sections</h3>
          <span className="sections-count">{sections.length} Sections</span>
        </div>

        {loading ? (
          <div className="sections-loading-state">
            <div className="sections-loading-spinner"></div>
            <p>Loading sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="sections-empty-state">
            <Users size={48} />
            <h4>No Sections Found</h4>
            <p>Start by adding your first section</p>
            <button 
              className="sections-add-first-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Add First Section
            </button>
          </div>
        ) : (
          <div className="sections-grid">
            {sections.map((section) => (
              <div key={section.id} className="sections-card">
                <div className="sections-card-header">
                  <div className="sections-card-icon">
                    <Users size={24} />
                  </div>
                  <div className="sections-card-actions">
                    <button className="sections-action-btn sections-edit-btn" title="Edit Section">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="sections-action-btn sections-delete-btn" 
                      title="Delete Section"
                      onClick={() => handleDeleteClick(section)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="sections-card-body">
                  <h4 className="sections-card-name">{section.className} - Section {section.sectionName}</h4>
                  <p className="sections-card-id">ID: {section.sectionId}</p>
                  <div className="sections-card-stats">
                    <div className="sections-stat-item">
                      <span className="sections-stat-label">Students</span>
                      <span className="sections-stat-value">{section.studentsCount || 0}</span>
                    </div>
                    <div className="sections-stat-item">
                      <span className="sections-stat-label">Class</span>
                      <span className="sections-stat-value">{section.classId}</span>
                    </div>
                  </div>
                  <div className="sections-card-status">
                    <span className="sections-status-badge sections-active">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="sections-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="sections-modal-content sections-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sections-modal-header">
              <h2>Delete Section</h2>
              <button className="sections-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="sections-modal-body">
              <div className="sections-delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Section?</h3>
              <p>
                Are you sure you want to delete section{' '}
                <strong>{selectedSection?.className} - {selectedSection?.sectionName}</strong>?
              </p>
              <p className="sections-warning-text">
                ⚠️ This action cannot be undone. All related data will be removed.
              </p>
            </div>

            <div className="sections-modal-footer">
              <button className="sections-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="sections-btn-delete-confirm" onClick={handleDeleteSection}>
                <Trash2 size={18} />
                Delete Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sections