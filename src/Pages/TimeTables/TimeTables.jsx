import React, { useState, useEffect } from 'react'
import './TimeTables.css'
import { collection, getDocs, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { Plus, X, Save, Edit, Trash2, Calendar, Clock, BookOpen, Users, GraduationCap, Filter, Search, Eye } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const TimeTables = () => {
  const [timeTables, setTimeTables] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [slots, setSlots] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedTimeTable, setSelectedTimeTable] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')

  const [timetableData, setTimetableData] = useState({
    classId: '',
    sectionId: '',
    className: '',
    sectionName: '',
    schedule: {}
  })

  const [selectedTimetableForEdit, setSelectedTimetableForEdit] = useState(null)
  const [selectedTimetableForDelete, setSelectedTimetableForDelete] = useState(null)
  const [editTimetableData, setEditTimetableData] = useState({
    classId: '',
    sectionId: '',
    className: '',
    sectionName: '',
    schedule: {}
  })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchClasses(),
        fetchSections(),
        fetchSubjects(),
        fetchSlots(),
        fetchTimeTables()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
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

  const fetchSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Subjects'))
      const subjectsData = []
      querySnapshot.forEach((doc) => {
        subjectsData.push({ id: doc.id, ...doc.data() })
      })
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchSlots = async () => {
    try {
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
    }
  }

  const fetchTimeTables = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'TimeTables'))
      const timeTablesData = []
      querySnapshot.forEach((doc) => {
        timeTablesData.push({ id: doc.id, ...doc.data() })
      })
      setTimeTables(timeTablesData)
    } catch (error) {
      console.error('Error fetching timetables:', error)
    }
  }

  const handleClassChange = (classId) => {
    const selectedClassData = classes.find(cls => cls.classId === classId)
    const classSections = sections.filter(section => section.classId === classId)
    
    setSelectedClass(classId)
    setSelectedSection('')
    setTimetableData(prev => ({
      ...prev,
      classId: classId,
      className: selectedClassData ? selectedClassData.className : '',
      sectionId: '',
      sectionName: ''
    }))
  }

  const handleSectionChange = (sectionId) => {
    const selectedSectionData = sections.find(section => section.sectionId === sectionId)
    
    setSelectedSection(sectionId)
    setTimetableData(prev => ({
      ...prev,
      sectionId: sectionId,
      sectionName: selectedSectionData ? selectedSectionData.sectionName : ''
    }))
  }

  const handleScheduleChange = (day, slotId, subjectId) => {
    setTimetableData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [slotId]: subjectId
        }
      }
    }))
  }

  const handleCreateTimetable = async () => {
    if (!timetableData.classId || !timetableData.sectionId) {
      showErrorToast('Please select class and section')
      return
    }

    setSubmitLoading(true)

    try {
      const timetableId = `${timetableData.classId}_${timetableData.sectionId}`
      
      // Check if timetable already exists
      const existingTimetable = timeTables.find(tt => tt.id === timetableId)
      if (existingTimetable) {
        showErrorToast('Timetable already exists for this class and section')
        setSubmitLoading(false)
        return
      }

      const timetableDoc = {
        classId: timetableData.classId,
        sectionId: timetableData.sectionId,
        className: timetableData.className,
        sectionName: timetableData.sectionName,
        schedule: timetableData.schedule,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      }

      await setDoc(doc(db, 'TimeTables', timetableId), timetableDoc)
      
      showSuccessToast('Timetable created successfully!')
      setShowCreateModal(false)
      resetForm()
      await fetchTimeTables()
    } catch (error) {
      console.error('Error creating timetable:', error)
      showErrorToast('Failed to create timetable')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEditClick = (timetable) => {
    setSelectedTimetableForEdit(timetable)
    setEditTimetableData({
      classId: timetable.classId,
      sectionId: timetable.sectionId,
      className: timetable.className,
      sectionName: timetable.sectionName,
      schedule: timetable.schedule || {}
    })
    setSelectedClass(timetable.classId)
    setSelectedSection(timetable.sectionId)
    setShowEditModal(true)
  }

  const handleDeleteClick = (timetable) => {
    setSelectedTimetableForDelete(timetable)
    setShowDeleteModal(true)
  }

  const handleEditScheduleChange = (day, slotId, subjectId) => {
    setEditTimetableData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [slotId]: subjectId
        }
      }
    }))
  }

  const handleUpdateTimetable = async () => {
    if (!editTimetableData.classId || !editTimetableData.sectionId) {
      showErrorToast('Please select class and section')
      return
    }

    setSubmitLoading(true)

    try {
      const timetableId = `${editTimetableData.classId}_${editTimetableData.sectionId}`
      
      const timetableDoc = {
        classId: editTimetableData.classId,
        sectionId: editTimetableData.sectionId,
        className: editTimetableData.className,
        sectionName: editTimetableData.sectionName,
        schedule: editTimetableData.schedule,
        updatedAt: new Date().toISOString(),
        status: 'active'
      }

      await setDoc(doc(db, 'TimeTables', timetableId), timetableDoc, { merge: true })
      
      showSuccessToast('Timetable updated successfully!')
      setShowEditModal(false)
      setSelectedTimetableForEdit(null)
      resetEditForm()
      await fetchTimeTables()
    } catch (error) {
      console.error('Error updating timetable:', error)
      showErrorToast('Failed to update timetable')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteTimetable = async () => {
    try {
      const timetableId = `${selectedTimetableForDelete.classId}_${selectedTimetableForDelete.sectionId}`
      await deleteDoc(doc(db, 'TimeTables', timetableId))
      
      showSuccessToast('Timetable deleted successfully!')
      setShowDeleteModal(false)
      setSelectedTimetableForDelete(null)
      await fetchTimeTables()
    } catch (error) {
      console.error('Error deleting timetable:', error)
      showErrorToast('Failed to delete timetable')
    }
  }

  const resetForm = () => {
    setTimetableData({
      classId: '',
      sectionId: '',
      className: '',
      sectionName: '',
      schedule: {}
    })
    setSelectedClass('')
    setSelectedSection('')
  }

  const resetEditForm = () => {
    setEditTimetableData({
      classId: '',
      sectionId: '',
      className: '',
      sectionName: '',
      schedule: {}
    })
    setSelectedClass('')
    setSelectedSection('')
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour12 = hours % 12 || 12
    const ampm = hours >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(sub => sub.subjectCode === subjectId)
    return subject ? subject.subjectName : 'Free Period'
  }

  const filteredTimeTables = timeTables.filter(timetable => {
    const matchesSearch = searchTerm === '' || 
      timetable.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.sectionName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = filterClass === '' || timetable.classId === filterClass
    
    return matchesSearch && matchesClass
  })

  return (
    <div className="timetables-container">
      {/* Header Section */}
      <div className="timetables-header">
        <div className="timetables-header-content">
          <h2>Class Timetables</h2>
          <p>Manage class schedules and timetables</p>
        </div>
        <button 
          className="timetables-add-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          Create Timetable
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="timetables-filters">
        <div className="timetables-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by class or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="timetables-filter">
          <Filter size={18} />
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {classes.map((classItem) => (
              <option key={classItem.classId} value={classItem.classId}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetables List */}
      <div className="timetables-list-container">
        <div className="timetables-list-header">
          <h3>All Timetables</h3>
          <span className="timetables-count">{filteredTimeTables.length} Timetables</span>
        </div>

        {loading ? (
          <div className="timetables-loading-state">
            <div className="timetables-loading-spinner"></div>
            <p>Loading timetables...</p>
          </div>
        ) : filteredTimeTables.length === 0 ? (
          <div className="timetables-empty-state">
            <Calendar size={48} />
            <h4>No Timetables Found</h4>
            <p>Start by creating your first timetable</p>
            <button 
              className="timetables-add-first-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Create First Timetable
            </button>
          </div>
        ) : (
          <div className="timetables-grid">
            {filteredTimeTables.map((timetable) => (
              <div key={timetable.id} className="timetables-card">
                <div className="timetables-card-header">
                  <div className="timetables-card-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="timetables-card-actions">
                    <button 
                      className="timetables-action-btn timetables-view-btn" 
                      title="View Timetable"
                      onClick={() => {
                        setSelectedTimeTable(timetable)
                        setShowViewModal(true)
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="timetables-action-btn timetables-edit-btn" 
                      title="Edit Timetable"
                      onClick={() => handleEditClick(timetable)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="timetables-action-btn timetables-delete-btn" 
                      title="Delete Timetable"
                      onClick={() => handleDeleteClick(timetable)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="timetables-card-body">
                  <h4 className="timetables-card-title">
                    {timetable.className} - Section {timetable.sectionName}
                  </h4>
                  <div className="timetables-card-info">
                    <div className="timetables-info-item">
                      <GraduationCap size={16} />
                      <span>Class: {timetable.classId}</span>
                    </div>
                    <div className="timetables-info-item">
                      <Users size={16} />
                      <span>Section: {timetable.sectionName}</span>
                    </div>
                    <div className="timetables-info-item">
                      <Clock size={16} />
                      <span>{Object.keys(timetable.schedule || {}).length} Days</span>
                    </div>
                  </div>
                  <div className="timetables-card-status">
                    <span className="timetables-status-badge timetables-active">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Timetable Modal */}
      {showCreateModal && (
        <div className="timetables-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="timetables-modal-content timetables-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="timetables-modal-header">
              <h2>Create New Timetable</h2>
              <button className="timetables-close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="timetables-modal-body">
              {/* Class and Section Selection */}
              <div className="timetables-selection-section">
                <div className="timetables-selection-grid">
                  <div className="timetables-form-group">
                    <label>Select Class <span className="timetables-required">*</span></label>
                    <select
                      value={selectedClass}
                      onChange={(e) => handleClassChange(e.target.value)}
                      required
                    >
                      <option value="">Choose Class</option>
                      {classes.map((classItem) => (
                        <option key={classItem.classId} value={classItem.classId}>
                          {classItem.className} ({classItem.classId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="timetables-form-group">
                    <label>Select Section <span className="timetables-required">*</span></label>
                    <select
                      value={selectedSection}
                      onChange={(e) => handleSectionChange(e.target.value)}
                      disabled={!selectedClass}
                      required
                    >
                      <option value="">Choose Section</option>
                      {sections
                        .filter(section => section.classId === selectedClass)
                        .map((section) => (
                          <option key={section.sectionId} value={section.sectionId}>
                            Section {section.sectionName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Timetable Grid */}
              {selectedClass && selectedSection && (
                <div className="timetables-schedule-section">
                  <h3>Create Schedule</h3>
                  <div className="timetables-schedule-grid">
                    <div className="timetables-schedule-header">
                      <div className="timetables-schedule-cell timetables-day-header">Day / Time</div>
                      {slots.map((slot) => (
                        <div key={slot.slotId} className="timetables-schedule-cell timetables-slot-header">
                          <div className="timetables-slot-name">{slot.slotName}</div>
                          <div className="timetables-slot-time">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {daysOfWeek.map((day) => (
                      <div key={day} className="timetables-schedule-row">
                        <div className="timetables-schedule-cell timetables-day-cell">{day}</div>
                        {slots.map((slot) => (
                          <div key={`${day}-${slot.slotId}`} className="timetables-schedule-cell timetables-subject-cell">
                            <select
                              value={timetableData.schedule[day]?.[slot.slotId] || ''}
                              onChange={(e) => handleScheduleChange(day, slot.slotId, e.target.value)}
                            >
                              <option value="">Free Period</option>
                              {subjects
                                .filter(subject => subject.classId === selectedClass)
                                .map((subject) => (
                                  <option key={subject.subjectCode} value={subject.subjectCode}>
                                    {subject.subjectName}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="timetables-modal-footer">
              <button className="timetables-btn-cancel" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button 
                className="timetables-btn-save" 
                onClick={handleCreateTimetable}
                disabled={submitLoading || !selectedClass || !selectedSection}
              >
                <Save size={18} />
                {submitLoading ? 'Creating...' : 'Create Timetable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Timetable Modal */}
      {showViewModal && selectedTimeTable && (
        <div className="timetables-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="timetables-modal-content timetables-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="timetables-modal-header">
              <h2>{selectedTimeTable.className} - Section {selectedTimeTable.sectionName}</h2>
              <button className="timetables-close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="timetables-modal-body">
              <div className="timetables-view-schedule">
                <div className="timetables-schedule-grid">
                  <div className="timetables-schedule-header">
                    <div className="timetables-schedule-cell timetables-day-header">Day / Time</div>
                    {slots.map((slot) => (
                      <div key={slot.slotId} className="timetables-schedule-cell timetables-slot-header">
                        <div className="timetables-slot-name">{slot.slotName}</div>
                        <div className="timetables-slot-time">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {daysOfWeek.map((day) => (
                    <div key={day} className="timetables-schedule-row">
                      <div className="timetables-schedule-cell timetables-day-cell">{day}</div>
                      {slots.map((slot) => (
                        <div key={`${day}-${slot.slotId}`} className="timetables-schedule-cell timetables-subject-view-cell">
                          <div className="timetables-subject-name">
                            {getSubjectName(selectedTimeTable.schedule[day]?.[slot.slotId])}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="timetables-modal-footer">
              <button className="timetables-btn-cancel" onClick={() => setShowViewModal(false)}>
                <X size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Timetable Modal */}
      {showEditModal && selectedTimetableForEdit && (
        <div className="timetables-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="timetables-modal-content timetables-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="timetables-modal-header">
              <h2>Edit Timetable - {selectedTimetableForEdit.className} Section {selectedTimetableForEdit.sectionName}</h2>
              <button className="timetables-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="timetables-modal-body">
              {/* Class and Section Info (Read-only) */}
              <div className="timetables-selection-section">
                <div className="timetables-selection-grid">
                  <div className="timetables-form-group">
                    <label>Class</label>
                    <input
                      type="text"
                      value={`${editTimetableData.className} (${editTimetableData.classId})`}
                      disabled
                      className="timetables-readonly-input"
                    />
                  </div>

                  <div className="timetables-form-group">
                    <label>Section</label>
                    <input
                      type="text"
                      value={`Section ${editTimetableData.sectionName}`}
                      disabled
                      className="timetables-readonly-input"
                    />
                  </div>
                </div>
              </div>

              {/* Timetable Grid */}
              <div className="timetables-schedule-section">
                <h3>Edit Schedule</h3>
                <div className="timetables-schedule-grid">
                  <div className="timetables-schedule-header">
                    <div className="timetables-schedule-cell timetables-day-header">Day / Time</div>
                    {slots.map((slot) => (
                      <div key={slot.slotId} className="timetables-schedule-cell timetables-slot-header">
                        <div className="timetables-slot-name">{slot.slotName}</div>
                        <div className="timetables-slot-time">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {daysOfWeek.map((day) => (
                    <div key={day} className="timetables-schedule-row">
                      <div className="timetables-schedule-cell timetables-day-cell">{day}</div>
                      {slots.map((slot) => (
                        <div key={`${day}-${slot.slotId}`} className="timetables-schedule-cell timetables-subject-cell">
                          <select
                            value={editTimetableData.schedule[day]?.[slot.slotId] || ''}
                            onChange={(e) => handleEditScheduleChange(day, slot.slotId, e.target.value)}
                          >
                            <option value="">Free Period</option>
                            {subjects
                              .filter(subject => subject.classId === editTimetableData.classId)
                              .map((subject) => (
                                <option key={subject.subjectCode} value={subject.subjectCode}>
                                  {subject.subjectName}
                                </option>
                              ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="timetables-modal-footer">
              <button className="timetables-btn-cancel" onClick={() => setShowEditModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button 
                className="timetables-btn-save" 
                onClick={handleUpdateTimetable}
                disabled={submitLoading}
              >
                <Save size={18} />
                {submitLoading ? 'Updating...' : 'Update Timetable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTimetableForDelete && (
        <div className="timetables-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="timetables-modal-content timetables-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="timetables-modal-header">
              <h2>Delete Timetable</h2>
              <button className="timetables-close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="timetables-modal-body">
              <div className="timetables-delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Timetable?</h3>
              <p>
                Are you sure you want to delete the timetable for{' '}
                <strong>{selectedTimetableForDelete.className} - Section {selectedTimetableForDelete.sectionName}</strong>?
              </p>
              <p className="timetables-warning-text">
                ⚠️ This action cannot be undone. All schedule data will be permanently removed.
              </p>
            </div>

            <div className="timetables-modal-footer">
              <button className="timetables-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                <X size={18} />
                Cancel
              </button>
              <button className="timetables-btn-delete-confirm" onClick={handleDeleteTimetable}>
                <Trash2 size={18} />
                Delete Timetable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeTables
