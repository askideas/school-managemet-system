import React, { useState, useEffect } from 'react'
import './NoticeBoard.css'
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { 
  Plus, 
  X, 
  Save, 
  Edit, 
  Trash2, 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle,
  Info,
  CheckCircle,
  Eye,
  FileText,
  Users,
  Clock
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const NoticeBoard = () => {
  const [notices, setNotices] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [noticeToDelete, setNoticeToDelete] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    priority: '',
    targetAudience: '',
    validFrom: '',
    validTo: '',
    isActive: true
  })

  const noticeTypes = [
    { value: 'general', label: 'General', icon: <Info size={16} /> },
    { value: 'academic', label: 'Academic', icon: <FileText size={16} /> },
    { value: 'exam', label: 'Exam', icon: <CheckCircle size={16} /> },
    { value: 'event', label: 'Event', icon: <Calendar size={16} /> },
    { value: 'holiday', label: 'Holiday', icon: <Clock size={16} /> },
    { value: 'urgent', label: 'Urgent', icon: <AlertTriangle size={16} /> }
  ]

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#6b7280' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'critical', label: 'Critical', color: '#dc2626' }
  ]

  const audienceTypes = [
    'All Students',
    'All Teachers',
    'All Staff',
    'Parents',
    'Class 1-5',
    'Class 6-10',
    'Class 11-12',
    'Administration'
  ]

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Notices'))
      const noticesData = []
      querySnapshot.forEach((doc) => {
        noticesData.push({ id: doc.id, ...doc.data() })
      })
      // Sort by creation date, newest first
      noticesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setNotices(noticesData)
    } catch (error) {
      console.error('Error fetching notices:', error)
      showErrorToast('Failed to fetch notices')
    } finally {
      setLoading(false)
    }
  }

  const generateNoticeId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `NOTICE_${timestamp}_${random}`
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.type || !formData.priority) {
      showErrorToast('Please fill all required fields')
      return
    }

    setSubmitLoading(true)

    try {
      const noticeId = editingNotice ? editingNotice.id : generateNoticeId()
      
      const noticeData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      }

      if (editingNotice) {
        await updateDoc(doc(db, 'Notices', noticeId), noticeData)
        showSuccessToast('Notice updated successfully!')
      } else {
        noticeData.createdAt = new Date().toISOString()
        noticeData.createdBy = 'Admin' // You can replace with actual user
        await setDoc(doc(db, 'Notices', noticeId), noticeData)
        showSuccessToast('Notice created successfully!')
      }

      resetForm()
      await fetchNotices()
    } catch (error) {
      console.error('Error saving notice:', error)
      showErrorToast('Failed to save notice')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority,
      targetAudience: notice.targetAudience || '',
      validFrom: notice.validFrom || '',
      validTo: notice.validTo || '',
      isActive: notice.isActive
    })
    setShowAddForm(true)
  }

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'Notices', noticeToDelete.id))
      showSuccessToast('Notice deleted successfully!')
      setShowDeleteModal(false)
      setNoticeToDelete(null)
      await fetchNotices()
    } catch (error) {
      console.error('Error deleting notice:', error)
      showErrorToast('Failed to delete notice')
    }
  }

  const handleView = (notice) => {
    setSelectedNotice(notice)
    setShowViewModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: '',
      priority: '',
      targetAudience: '',
      validFrom: '',
      validTo: '',
      isActive: true
    })
    setEditingNotice(null)
    setShowAddForm(false)
  }

  const getFilteredNotices = () => {
    return notices.filter(notice => {
      const matchesSearch = searchTerm === '' || 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType === '' || notice.type === filterType
      const matchesPriority = filterPriority === '' || notice.priority === filterPriority
      
      return matchesSearch && matchesType && matchesPriority
    })
  }

  const getNoticeTypeInfo = (type) => {
    return noticeTypes.find(t => t.value === type) || { label: type, icon: <Info size={16} /> }
  }

  const getPriorityInfo = (priority) => {
    return priorityLevels.find(p => p.value === priority) || { label: priority, color: '#6b7280' }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isNoticeActive = (notice) => {
    if (!notice.isActive) return false
    
    const now = new Date()
    const validFrom = notice.validFrom ? new Date(notice.validFrom) : null
    const validTo = notice.validTo ? new Date(notice.validTo) : null
    
    if (validFrom && now < validFrom) return false
    if (validTo && now > validTo) return false
    
    return true
  }

  return (
    <div className="noticeboard-container">
      {/* Header Section */}
      <div className="noticeboard-header">
        <div className="noticeboard-header-content">
          <h2>Notice Board</h2>
          <p>Manage school notices and announcements</p>
        </div>
        <button 
          className="noticeboard-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          Add Notice
        </button>
      </div>

      {/* Add/Edit Notice Form */}
      {showAddForm && (
        <div className="noticeboard-form-container">
          <div className="noticeboard-form-header">
            <h3>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h3>
            <button 
              className="noticeboard-close-btn"
              onClick={resetForm}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="noticeboard-form">
            <div className="noticeboard-form-grid">
              <div className="noticeboard-form-group noticeboard-full-width">
                <label>Notice Title <span className="noticeboard-required">*</span></label>
                <div className="noticeboard-input-with-icon">
                  <Bell size={18} className="noticeboard-input-icon" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter notice title"
                    required
                  />
                </div>
              </div>

              <div className="noticeboard-form-group">
                <label>Notice Type <span className="noticeboard-required">*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {noticeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="noticeboard-form-group">
                <label>Priority <span className="noticeboard-required">*</span></label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Priority</option>
                  {priorityLevels.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="noticeboard-form-group">
                <label>Target Audience</label>
                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                >
                  <option value="">Select Audience</option>
                  {audienceTypes.map((audience) => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </div>

              <div className="noticeboard-form-group">
                <label>Valid From</label>
                <div className="noticeboard-input-with-icon">
                  <Calendar size={18} className="noticeboard-input-icon" />
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="noticeboard-form-group">
                <label>Valid To</label>
                <div className="noticeboard-input-with-icon">
                  <Calendar size={18} className="noticeboard-input-icon" />
                  <input
                    type="date"
                    name="validTo"
                    value={formData.validTo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="noticeboard-form-group noticeboard-full-width">
                <label>Notice Content <span className="noticeboard-required">*</span></label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter notice content..."
                  rows="5"
                  className="noticeboard-textarea"
                  required
                />
              </div>

              <div className="noticeboard-form-group noticeboard-checkbox-group">
                <label className="noticeboard-checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Active Notice
                </label>
              </div>
            </div>

            <div className="noticeboard-form-actions">
              <button type="button" className="noticeboard-btn-reset" onClick={resetForm}>
                <X size={18} />
                Cancel
              </button>
              <button 
                type="submit" 
                className="noticeboard-btn-submit" 
                disabled={submitLoading}
              >
                <Save size={18} />
                {submitLoading ? 'Saving...' : editingNotice ? 'Update Notice' : 'Create Notice'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="noticeboard-filters">
        <div className="noticeboard-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="noticeboard-filter-controls">
          <div className="noticeboard-filter">
            <Filter size={18} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              {noticeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="noticeboard-filter">
            <AlertTriangle size={18} />
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">All Priorities</option>
              {priorityLevels.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="noticeboard-list-container">
        <div className="noticeboard-list-header">
          <h3>All Notices</h3>
          <span className="noticeboard-count">{getFilteredNotices().length} Notices</span>
        </div>

        {loading ? (
          <div className="noticeboard-loading-state">
            <div className="noticeboard-loading-spinner"></div>
            <p>Loading notices...</p>
          </div>
        ) : getFilteredNotices().length === 0 ? (
          <div className="noticeboard-empty-state">
            <Bell size={48} />
            <h4>No Notices Found</h4>
            <p>Start by creating your first notice</p>
            <button 
              className="noticeboard-add-first-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Create First Notice
            </button>
          </div>
        ) : (
          <div className="noticeboard-grid">
            {getFilteredNotices().map((notice) => {
              const typeInfo = getNoticeTypeInfo(notice.type)
              const priorityInfo = getPriorityInfo(notice.priority)
              const isActive = isNoticeActive(notice)

              return (
                <div key={notice.id} className={`noticeboard-card ${!isActive ? 'inactive' : ''}`}>
                  <div className="noticeboard-card-header">
                    <div className="noticeboard-card-left">
                      <div className="noticeboard-card-icon">
                        {typeInfo.icon}
                      </div>
                      <div className="noticeboard-card-badges">
                        <span className={`noticeboard-type-badge noticeboard-type-${notice.type}`}>
                          {typeInfo.label}
                        </span>
                        <span 
                          className={`noticeboard-priority-badge noticeboard-priority-${notice.priority}`}
                          style={{ background: `${priorityInfo.color}20`, color: priorityInfo.color }}
                        >
                          {priorityInfo.label}
                        </span>
                      </div>
                    </div>
                    <div className="noticeboard-card-actions">
                      <button 
                        className="noticeboard-action-btn noticeboard-view-btn"
                        onClick={() => handleView(notice)}
                        title="View Notice"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="noticeboard-action-btn noticeboard-edit-btn"
                        onClick={() => handleEdit(notice)}
                        title="Edit Notice"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="noticeboard-action-btn noticeboard-delete-btn"
                        onClick={() => {
                          setNoticeToDelete(notice)
                          setShowDeleteModal(true)
                        }}
                        title="Delete Notice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="noticeboard-card-body">
                    <h4 className="noticeboard-card-title">{notice.title}</h4>
                    <p className="noticeboard-card-content">
                      {notice.content.length > 120 
                        ? `${notice.content.substring(0, 120)}...` 
                        : notice.content
                      }
                    </p>
                    
                    <div className="noticeboard-card-meta">
                      {notice.targetAudience && (
                        <div className="noticeboard-meta-item">
                          <Users size={14} />
                          <span>{notice.targetAudience}</span>
                        </div>
                      )}
                      <div className="noticeboard-meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                      {notice.validTo && (
                        <div className="noticeboard-meta-item">
                          <Clock size={14} />
                          <span>Until {formatDate(notice.validTo)}</span>
                        </div>
                      )}
                    </div>

                    <div className="noticeboard-card-status">
                      <span className={`noticeboard-status-badge ${isActive ? 'active' : 'inactive'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* View Notice Modal */}
      {showViewModal && selectedNotice && (
        <div className="noticeboard-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="noticeboard-modal-content noticeboard-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="noticeboard-modal-header">
              <h2>Notice Details</h2>
              <button className="noticeboard-close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="noticeboard-modal-body">
              <div className="noticeboard-view-content">
                <div className="noticeboard-view-header">
                  <h3>{selectedNotice.title}</h3>
                  <div className="noticeboard-view-badges">
                    <span className={`noticeboard-type-badge noticeboard-type-${selectedNotice.type}`}>
                      {getNoticeTypeInfo(selectedNotice.type).label}
                    </span>
                    <span 
                      className={`noticeboard-priority-badge noticeboard-priority-${selectedNotice.priority}`}
                      style={{ 
                        background: `${getPriorityInfo(selectedNotice.priority).color}20`, 
                        color: getPriorityInfo(selectedNotice.priority).color 
                      }}
                    >
                      {getPriorityInfo(selectedNotice.priority).label}
                    </span>
                  </div>
                </div>

                <div className="noticeboard-view-meta">
                  <div className="noticeboard-view-meta-item">
                    <strong>Created:</strong> {formatDate(selectedNotice.createdAt)}
                  </div>
                  {selectedNotice.targetAudience && (
                    <div className="noticeboard-view-meta-item">
                      <strong>Target Audience:</strong> {selectedNotice.targetAudience}
                    </div>
                  )}
                  {selectedNotice.validFrom && (
                    <div className="noticeboard-view-meta-item">
                      <strong>Valid From:</strong> {formatDate(selectedNotice.validFrom)}
                    </div>
                  )}
                  {selectedNotice.validTo && (
                    <div className="noticeboard-view-meta-item">
                      <strong>Valid To:</strong> {formatDate(selectedNotice.validTo)}
                    </div>
                  )}
                </div>

                <div className="noticeboard-view-content-text">
                  <h4>Notice Content:</h4>
                  <div className="noticeboard-content-display">
                    {selectedNotice.content}
                  </div>
                </div>
              </div>
            </div>

            <div className="noticeboard-modal-footer">
              <button className="noticeboard-btn-cancel" onClick={() => setShowViewModal(false)}>
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && noticeToDelete && (
        <div className="noticeboard-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="noticeboard-modal-content noticeboard-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="noticeboard-modal-header">
              <h2>Delete Notice</h2>
              <button className="noticeboard-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="noticeboard-modal-body">
              <div className="noticeboard-delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Notice?</h3>
              <p>
                Are you sure you want to delete the notice{' '}
                <strong>"{noticeToDelete.title}"</strong>?
              </p>
              <p className="noticeboard-warning-text">
                ⚠️ This action cannot be undone. The notice will be permanently removed.
              </p>
            </div>

            <div className="noticeboard-modal-footer">
              <button className="noticeboard-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="noticeboard-btn-delete-confirm" onClick={handleDelete}>
                <Trash2 size={18} />
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticeBoard