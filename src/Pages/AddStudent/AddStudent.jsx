import React, { useState, useEffect } from 'react'
import './AddStudent.css'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Save, X, Upload, Users, Hash, School } from 'lucide-react'
import { db } from '../../firebase'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const AddStudent = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    admissionNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    caste: '',
    nationality: 'Indian',
    motherTongue: '',
    
    // Academic Information
    classId: '',
    className: '',
    sectionId: '',
    sectionName: '',
    rollNumber: '',
    admissionDate: '',
    academicYear: '',
    previousSchool: '',
    
    // Contact Information
    email: '',
    mobile: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Parent/Guardian Information
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianEmail: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Documents
    aadharNumber: '',
    birthCertificateNumber: '',
    previousSchoolTC: '',
    
    // Additional Information
    transportRequired: false,
    hostelRequired: false,
    medicalConditions: '',
    allergies: '',
    specialNeeds: '',
    remarks: ''
  })

  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    fetchClasses()
    generateAdmissionNumber()
  }, [])

  useEffect(() => {
    if (formData.classId) {
      fetchSections(formData.classId)
    }
  }, [formData.classId])

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

  const fetchSections = async (classId) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Sections'))
      const sectionsData = []
      querySnapshot.forEach((doc) => {
        const sectionData = doc.data()
        if (sectionData.classId === classId) {
          sectionsData.push({ id: doc.id, ...sectionData })
        }
      })
      setSections(sectionsData)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const generateAdmissionNumber = async () => {
    try {
      let admissionNumber
      let isUnique = false
      
      while (!isUnique) {
        // Generate 8-digit number
        admissionNumber = Math.floor(10000000 + Math.random() * 90000000).toString()
        
        // Check if this admission number already exists
        const querySnapshot = await getDocs(collection(db, 'Students'))
        const existingNumbers = []
        querySnapshot.forEach((doc) => {
          existingNumbers.push(doc.data().admissionNumber)
        })
        
        if (!existingNumbers.includes(admissionNumber)) {
          isUnique = true
        }
      }
      
      setFormData(prev => ({
        ...prev,
        admissionNumber: admissionNumber
      }))
    } catch (error) {
      console.error('Error generating admission number:', error)
      // Fallback to timestamp-based number if Firebase query fails
      const fallbackNumber = Date.now().toString().slice(-8)
      setFormData(prev => ({
        ...prev,
        admissionNumber: fallbackNumber
      }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'classId') {
      const selectedClass = classes.find(cls => cls.classId === value)
      setFormData(prev => ({
        ...prev,
        classId: value,
        className: selectedClass ? selectedClass.className : '',
        sectionId: '',
        sectionName: ''
      }))
    } else if (name === 'sectionId') {
      const selectedSection = sections.find(section => section.sectionId === value)
      setFormData(prev => ({
        ...prev,
        sectionId: value,
        sectionName: selectedSection ? selectedSection.sectionName : ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.classId) {
      showErrorToast('Please fill all required fields')
      return
    }

    if (formData.mobile && formData.mobile.length !== 10) {
      showErrorToast('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)

    try {
      const studentData = {
        ...formData,
        profileImage: profileImage || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        isActive: true
      }

      await setDoc(doc(db, 'Students', formData.admissionNumber), studentData)
      
      showSuccessToast('Student added successfully!')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        admissionNumber: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        religion: '',
        caste: '',
        nationality: 'Indian',
        motherTongue: '',
        classId: '',
        className: '',
        sectionId: '',
        sectionName: '',
        rollNumber: '',
        admissionDate: '',
        academicYear: '',
        previousSchool: '',
        email: '',
        mobile: '',
        alternatePhone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        fatherName: '',
        fatherOccupation: '',
        fatherPhone: '',
        fatherEmail: '',
        motherName: '',
        motherOccupation: '',
        motherPhone: '',
        motherEmail: '',
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        guardianEmail: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        aadharNumber: '',
        birthCertificateNumber: '',
        previousSchoolTC: '',
        transportRequired: false,
        hostelRequired: false,
        medicalConditions: '',
        allergies: '',
        specialNeeds: '',
        remarks: ''
      })
      setProfileImage(null)
      generateAdmissionNumber()

    } catch (err) {
      console.error('Error details:', err)
      showErrorToast(`Failed to add student: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      admissionNumber: formData.admissionNumber, // Keep the generated admission number
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      religion: '',
      caste: '',
      nationality: 'Indian',
      motherTongue: '',
      classId: '',
      className: '',
      sectionId: '',
      sectionName: '',
      rollNumber: '',
      admissionDate: '',
      academicYear: '',
      previousSchool: '',
      email: '',
      mobile: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      fatherName: '',
      fatherOccupation: '',
      fatherPhone: '',
      fatherEmail: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      motherEmail: '',
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      guardianEmail: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      aadharNumber: '',
      birthCertificateNumber: '',
      previousSchoolTC: '',
      transportRequired: false,
      hostelRequired: false,
      medicalConditions: '',
      allergies: '',
      specialNeeds: '',
      remarks: ''
    })
    setProfileImage(null)
  }

  return (
    <div className="add-student-container">
      <div className="add-student-header">
        <h2>Add New Student</h2>
        <p>Fill in the details below to add a new student to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="add-student-form">
        {/* Profile Photo Upload */}
        <div className="form-section">
          <h3 className="section-title">Profile Photo (Optional)</h3>
          <div className="profile-upload-section">
            <div className="image-preview">
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" />
              ) : (
                <div className="placeholder-icon">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="upload-controls">
              <label htmlFor="profileImage" className="upload-btn">
                <Upload size={16} />
                Upload Photo
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">Upload a clear photo of the student (Optional - Max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Admission Number</label>
              <div className="input-with-icon">
                <Hash size={18} className="input-icon" />
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <small className="input-hint">Auto-generated unique 8-digit number</small>
            </div>

            <div className="form-group">
              <label>Academic Year</label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
              >
                <option value="">Select Academic Year</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>

            <div className="form-group">
              <label>First Name <span className="required">*</span></label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Last Name <span className="required">*</span></label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Date of Birth <span className="required">*</span></label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
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

            <div className="form-group">
              <label>Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                placeholder="Enter religion"
              />
            </div>

            <div className="form-group">
              <label>Caste</label>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleInputChange}
                placeholder="Enter caste"
              />
            </div>

            <div className="form-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Enter nationality"
              />
            </div>

            <div className="form-group">
              <label>Mother Tongue</label>
              <input
                type="text"
                name="motherTongue"
                value={formData.motherTongue}
                onChange={handleInputChange}
                placeholder="Enter mother tongue"
              />
            </div>

            <div className="form-group">
              <label>Admission Date</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="form-section">
          <h3 className="section-title">Academic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Class <span className="required">*</span></label>
              <div className="input-with-icon">
                <School size={18} className="input-icon" />
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.classId} value={classItem.classId}>
                      {classItem.className}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Section</label>
              <div className="input-with-icon">
                <Users size={18} className="input-icon" />
                <select
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleInputChange}
                  disabled={!formData.classId}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.sectionId} value={section.sectionId}>
                      Section {section.sectionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                placeholder="Enter roll number"
              />
            </div>

            <div className="form-group">
              <label>Previous School</label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleInputChange}
                placeholder="Enter previous school name"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Alternate Phone</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  placeholder="Enter alternate phone number"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                />
              </div>
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
                maxLength="6"
              />
            </div>
          </div>
        </div>

        {/* Father Information */}
        <div className="form-section">
          <h3 className="section-title">Father Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Father's Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter father's name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Father's Occupation</label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleInputChange}
                placeholder="Enter father's occupation"
              />
            </div>

            <div className="form-group">
              <label>Father's Phone</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleInputChange}
                  placeholder="Enter father's phone"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Father's Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="fatherEmail"
                  value={formData.fatherEmail}
                  onChange={handleInputChange}
                  placeholder="Enter father's email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mother Information */}
        <div className="form-section">
          <h3 className="section-title">Mother Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Mother's Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Enter mother's name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mother's Occupation</label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleInputChange}
                placeholder="Enter mother's occupation"
              />
            </div>

            <div className="form-group">
              <label>Mother's Phone</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="motherPhone"
                  value={formData.motherPhone}
                  onChange={handleInputChange}
                  placeholder="Enter mother's phone"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mother's Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="motherEmail"
                  value={formData.motherEmail}
                  onChange={handleInputChange}
                  placeholder="Enter mother's email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="form-section">
          <h3 className="section-title">Guardian Information (If different from parents)</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Guardian's Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  placeholder="Enter guardian's name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Relation with Student</label>
              <input
                type="text"
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleInputChange}
                placeholder="Enter relation"
              />
            </div>

            <div className="form-group">
              <label>Guardian's Phone</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  placeholder="Enter guardian's phone"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Guardian's Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  placeholder="Enter guardian's email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="form-section">
          <h3 className="section-title">Emergency Contact</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                placeholder="Enter emergency contact name"
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Phone</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="Enter emergency phone"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Relation</label>
              <input
                type="text"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleInputChange}
                placeholder="Enter relation"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="form-section">
          <h3 className="section-title">Documents</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                placeholder="Enter 12-digit Aadhar number"
                maxLength="12"
              />
            </div>

            <div className="form-group">
              <label>Birth Certificate Number</label>
              <input
                type="text"
                name="birthCertificateNumber"
                value={formData.birthCertificateNumber}
                onChange={handleInputChange}
                placeholder="Enter birth certificate number"
              />
            </div>

            <div className="form-group">
              <label>Previous School TC Number</label>
              <input
                type="text"
                name="previousSchoolTC"
                value={formData.previousSchoolTC}
                onChange={handleInputChange}
                placeholder="Enter TC number"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3 className="section-title">Additional Information</h3>
          <div className="form-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transportRequired"
                  checked={formData.transportRequired}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Transport Required
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hostelRequired"
                  checked={formData.hostelRequired}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Hostel Required
              </label>
            </div>

            <div className="form-group full-width">
              <label>Medical Conditions</label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleInputChange}
                placeholder="Enter any medical conditions"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="Enter any allergies"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Special Needs</label>
              <textarea
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleInputChange}
                placeholder="Enter any special needs"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Any additional remarks"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-reset" onClick={handleReset}>
            <X size={18} />
            Reset
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            <Save size={18} />
            {loading ? 'Adding Student...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStudent
