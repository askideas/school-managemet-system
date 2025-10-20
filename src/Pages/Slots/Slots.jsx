import React, { useState, useEffect } from 'react'
import './Slots.css'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Plus, X, Save, Edit, Trash2, Clock, Hash, Calendar } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const Slots = () => {
  const [slots, setSlots] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  
  const [formData, setFormData] = useState({
    slotName: '',
    slotId: '',
    startTime: '',
    endTime: '',
    duration: '',
    slotType: '',
    description: ''
  })

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Slots'))
      const slotsData = []
      querySnapshot.forEach((doc) => {
        slotsData.push({ id: doc.id, ...doc.data() })
      })
      // Sort by start time
      slotsData.sort((a, b) => a.startTime.localeCompare(b.startTime))
      setSlots(slotsData)
    } catch (error) {
      console.error('Error fetching slots:', error)
      showErrorToast('Failed to fetch slots')
    } finally {
      setLoading(false)
    }
  }

  const generateSlotId = (slotName, startTime) => {
    if (!slotName || !startTime) return ''
    const cleanName = slotName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const timePrefix = startTime.replace(':', '').slice(0, 4)
    return `SLT${timePrefix}_${cleanName.slice(0, 3)}`
  }

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return ''
    
    const start = new Date(`1970-01-01T${startTime}:00`)
    const end = new Date(`1970-01-01T${endTime}:00`)
    
    if (end <= start) return ''
    
    const diffMs = end - start
    const diffMins = diffMs / (1000 * 60)
    
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${minutes}m`
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    let updatedFormData = { ...formData, [name]: value }
    
    if (name === 'slotName' || name === 'startTime') {
      updatedFormData.slotId = generateSlotId(
        name === 'slotName' ? value : formData.slotName,
        name === 'startTime' ? value : formData.startTime
      )
    }
    
    if (name === 'startTime' || name === 'endTime') {
      updatedFormData.duration = calculateDuration(
        name === 'startTime' ? value : formData.startTime,
        name === 'endTime' ? value : formData.endTime
      )
    }
    
    setFormData(updatedFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.slotName.trim()) {
      showErrorToast('Please enter slot name')
      return
    }

    if (!formData.startTime || !formData.endTime) {
      showErrorToast('Please select start and end time')
      return
    }

    if (!formData.slotType) {
      showErrorToast('Please select slot type')
      return
    }

    // Validate time order
    if (formData.startTime >= formData.endTime) {
      showErrorToast('End time must be after start time')
      return
    }

    // Check for overlapping slots
    const hasOverlap = slots.some(slot => {
      const slotStart = slot.startTime
      const slotEnd = slot.endTime
      const newStart = formData.startTime
      const newEnd = formData.endTime
      
      return (
        (newStart >= slotStart && newStart < slotEnd) ||
        (newEnd > slotStart && newEnd <= slotEnd) ||
        (newStart <= slotStart && newEnd >= slotEnd)
      )
    })

    if (hasOverlap) {
      showErrorToast('Time slot overlaps with existing slot')
      return
    }

    // Check if slot already exists
    const existingSlot = slots.find(slot => 
      slot.slotId === formData.slotId ||
      slot.slotName.toLowerCase() === formData.slotName.toLowerCase()
    )
    
    if (existingSlot) {
      showErrorToast('Slot already exists')
      return
    }

    setSubmitLoading(true)

    try {
      const slotData = {
        slotName: formData.slotName.trim(),
        slotId: formData.slotId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: formData.duration,
        slotType: formData.slotType,
        description: formData.description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      }

      await setDoc(doc(db, 'Slots', formData.slotId), slotData)
      
      showSuccessToast('Time slot added successfully!')
      setFormData({ 
        slotName: '', 
        slotId: '', 
        startTime: '', 
        endTime: '', 
        duration: '', 
        slotType: '', 
        description: '' 
      })
      setShowAddForm(false)
      await fetchSlots()
    } catch (error) {
      console.error('Error adding slot:', error)
      showErrorToast(`Failed to add slot: ${error.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (slot) => {
    setSelectedSlot(slot)
    setShowDeleteModal(true)
  }

  const handleDeleteSlot = async () => {
    try {
      await deleteDoc(doc(db, 'Slots', selectedSlot.slotId))
      showSuccessToast('Time slot deleted successfully!')
      setShowDeleteModal(false)
      setSelectedSlot(null)
      await fetchSlots()
    } catch (error) {
      console.error('Error deleting slot:', error)
      showErrorToast('Failed to delete slot')
    }
  }

  const handleReset = () => {
    setFormData({ 
      slotName: '', 
      slotId: '', 
      startTime: '', 
      endTime: '', 
      duration: '', 
      slotType: '', 
      description: '' 
    })
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour12 = hours % 12 || 12
    const ampm = hours >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="slots-container">
      {/* Header Section */}
      <div className="slots-header">
        <div className="slots-header-content">
          <h2>Time Slots Management</h2>
          <p>Manage time slots for timetable scheduling</p>
        </div>
        <button 
          className="slots-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          Add Time Slot
        </button>
      </div>

      {/* Add Slot Form */}
      {showAddForm && (
        <div className="slots-form-container">
          <div className="slots-form-header">
            <h3>Add New Time Slot</h3>
            <button 
              className="slots-close-btn"
              onClick={() => setShowAddForm(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="slots-form">
            <div className="slots-form-grid">
              <div className="slots-form-group">
                <label>Slot Name <span className="slots-required">*</span></label>
                <div className="slots-input-with-icon">
                  <Clock size={18} className="slots-input-icon" />
                  <input
                    type="text"
                    name="slotName"
                    value={formData.slotName}
                    onChange={handleInputChange}
                    placeholder="Enter slot name (e.g., Period 1, Lunch Break)"
                    required
                  />
                </div>
              </div>

              <div className="slots-form-group">
                <label>Slot Type <span className="slots-required">*</span></label>
                <select
                  name="slotType"
                  value={formData.slotType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Slot Type</option>
                  <option value="Academic">Academic Period</option>
                  <option value="Break">Break Time</option>
                  <option value="Lunch">Lunch Time</option>
                  <option value="Assembly">Assembly</option>
                  <option value="Activity">Activity Period</option>
                  <option value="Study">Study Period</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="slots-form-group">
                <label>Start Time <span className="slots-required">*</span></label>
                <div className="slots-input-with-icon">
                  <Calendar size={18} className="slots-input-icon" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="slots-form-group">
                <label>End Time <span className="slots-required">*</span></label>
                <div className="slots-input-with-icon">
                  <Calendar size={18} className="slots-input-icon" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="slots-form-group">
                <label>Duration (Auto Calculated)</label>
                <div className="slots-input-with-icon">
                  <Clock size={18} className="slots-input-icon" />
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    readOnly
                    placeholder="Duration will be calculated"
                    className="slots-readonly-input"
                  />
                </div>
              </div>

              <div className="slots-form-group">
                <label>Slot ID (Auto Generated)</label>
                <div className="slots-input-with-icon">
                  <Hash size={18} className="slots-input-icon" />
                  <input
                    type="text"
                    name="slotId"
                    value={formData.slotId}
                    readOnly
                    placeholder="Auto generated based on time and name"
                    className="slots-readonly-input"
                  />
                </div>
              </div>

              <div className="slots-form-group slots-full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter slot description (optional)"
                  rows="3"
                  className="slots-textarea"
                />
              </div>
            </div>

            <div className="slots-form-actions">
              <button type="button" className="slots-btn-reset" onClick={handleReset}>
                <X size={18} />
                Reset
              </button>
              <button type="submit" className="slots-btn-submit" disabled={submitLoading || !formData.slotName.trim() || !formData.startTime || !formData.endTime || !formData.slotType}>
                <Save size={18} />
                {submitLoading ? 'Adding...' : 'Add Time Slot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slots List */}
      <div className="slots-list-container">
        <div className="slots-list-header">
          <h3>All Time Slots</h3>
          <span className="slots-count">{slots.length} Slots</span>
        </div>

        {loading ? (
          <div className="slots-loading-state">
            <div className="slots-loading-spinner"></div>
            <p>Loading time slots...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="slots-empty-state">
            <Clock size={48} />
            <h4>No Time Slots Found</h4>
            <p>Start by adding your first time slot</p>
            <button 
              className="slots-add-first-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              Add First Time Slot
            </button>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div key={slot.id} className="slots-card">
                <div className="slots-card-header">
                  <div className="slots-card-icon">
                    <Clock size={24} />
                  </div>
                  <div className="slots-card-actions">
                    <button className="slots-action-btn slots-edit-btn" title="Edit Slot">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="slots-action-btn slots-delete-btn" 
                      title="Delete Slot"
                      onClick={() => handleDeleteClick(slot)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="slots-card-body">
                  <h4 className="slots-card-name">{slot.slotName}</h4>
                  <p className="slots-card-time">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>
                  <p className="slots-card-id">ID: {slot.slotId}</p>
                  
                  <div className="slots-card-info">
                    <div className="slots-info-item">
                      <span className="slots-info-label">Duration</span>
                      <span className="slots-info-value">{slot.duration}</span>
                    </div>
                    <div className="slots-info-item">
                      <span className="slots-info-label">Type</span>
                      <span className={`slots-type-badge slots-${slot.slotType.toLowerCase()}`}>
                        {slot.slotType}
                      </span>
                    </div>
                  </div>

                  {slot.description && (
                    <p className="slots-card-description">{slot.description}</p>
                  )}
                  
                  <div className="slots-card-status">
                    <span className="slots-status-badge slots-active">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="slots-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="slots-modal-content slots-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="slots-modal-header">
              <h2>Delete Time Slot</h2>
              <button className="slots-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="slots-modal-body">
              <div className="slots-delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Time Slot?</h3>
              <p>
                Are you sure you want to delete time slot{' '}
                <strong>{selectedSlot?.slotName}</strong>?
              </p>
              <p>
                Time: <strong>{formatTime(selectedSlot?.startTime)} - {formatTime(selectedSlot?.endTime)}</strong>
              </p>
              <p className="slots-warning-text">
                ⚠️ This action cannot be undone. All related timetable data will be affected.
              </p>
            </div>

            <div className="slots-modal-footer">
              <button className="slots-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="slots-btn-delete-confirm" onClick={handleDeleteSlot}>
                <Trash2 size={18} />
                Delete Time Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Slots