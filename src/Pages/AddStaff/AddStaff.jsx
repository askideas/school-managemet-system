import React, { useState } from 'react'
import './AddStaff.css'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Upload, Save, X } from 'lucide-react'

const firebaseConfig = {
  apiKey: "AIzaSyCivm3uoYsHrkOdKTnd94DIig6RepvkJtg",
  authDomain: "school-management-system-7fe4e.firebaseapp.com",
  projectId: "school-management-system-7fe4e",
  storageBucket: "school-management-system-7fe4e.firebasestorage.app",
  messagingSenderId: "841425938779",
  appId: "1:841425938779:web:f21b847d8c66fee736527e",
  measurementId: "G-95R4259KK1"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

const AddStaff = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    staffType: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    salary: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyContactName: '',
    aadharNumber: '',
    panNumber: ''
  })

  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (mobile) => {
    if (!profileImage) return null
    
    const imageRef = ref(storage, `staff/${mobile}/profile.jpg`)
    await uploadBytes(imageRef, profileImage)
    const imageUrl = await getDownloadURL(imageRef)
    return imageUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.staffType) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      // Upload image if exists
      let imageUrl = null
      if (profileImage) {
        imageUrl = await uploadImage(formData.mobile)
      }

      // Add staff to Firestore
      const staffData = {
        ...formData,
        profileImage: imageUrl,
        createdAt: new Date().toISOString(),
        status: 'active'
      }

      await setDoc(doc(db, 'Staff', formData.mobile), staffData)

      setSuccess('Staff added successfully!')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        staffType: '',
        department: '',
        designation: '',
        qualification: '',
        experience: '',
        joiningDate: '',
        salary: '',
        bloodGroup: '',
        emergencyContact: '',
        emergencyContactName: '',
        aadharNumber: '',
        panNumber: ''
      })
      setProfileImage(null)
      setImagePreview(null)

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error adding staff:', err)
      setError('Failed to add staff. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      staffType: '',
      department: '',
      designation: '',
      qualification: '',
      experience: '',
      joiningDate: '',
      salary: '',
      bloodGroup: '',
      emergencyContact: '',
      emergencyContactName: '',
      aadharNumber: '',
      panNumber: ''
    })
    setProfileImage(null)
    setImagePreview(null)
    setError('')
    setSuccess('')
  }

  return (
    <div className="add-staff-container">
      <div className="add-staff-header">
        <h2>Add New Staff</h2>
        <p>Fill in the details below to add a new staff member</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <X size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <Save size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-staff-form">
        {/* Profile Image Section */}
        <div className="form-section">
          <h3 className="section-title">Profile Photo</h3>
          <div className="profile-upload-section">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <div className="placeholder-icon">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="upload-controls">
              <label htmlFor="profileImage" className="upload-btn">
                <Upload size={18} />
                <span>Upload Photo</span>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="upload-hint">Allowed formats: JPG, PNG (Max 2MB)</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name <span className="required">*</span></label>
              <div className="input-with-icon">
                <User size={18} />
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
                <User size={18} />
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
              <label>Email <span className="required">*</span></label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number <span className="required">*</span></label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <div className="input-with-icon">
                <Calendar size={18} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
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
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                placeholder="Enter PAN number"
                maxLength="10"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h3 className="section-title">Address Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Address</label>
              <div className="input-with-icon">
                <MapPin size={18} />
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

        {/* Professional Information */}
        <div className="form-section">
          <h3 className="section-title">Professional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Staff Type <span className="required">*</span></label>
              <div className="input-with-icon">
                <Briefcase size={18} />
                <select
                  name="staffType"
                  value={formData.staffType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Staff Type</option>
                  <option value="Teaching Staff">Teaching Staff</option>
                  <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                  <option value="Administrative Staff">Administrative Staff</option>
                  <option value="Support Staff">Support Staff</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter department"
              />
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Enter designation"
              />
            </div>

            <div className="form-group">
              <label>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                placeholder="Enter qualification"
              />
            </div>

            <div className="form-group">
              <label>Experience (in years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Enter experience"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Joining Date</label>
              <div className="input-with-icon">
                <Calendar size={18} />
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Monthly Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Enter monthly salary"
                min="0"
              />
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
                placeholder="Enter contact person name"
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Number</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Enter emergency contact number"
                  maxLength="10"
                />
              </div>
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
            {loading ? 'Adding Staff...' : 'Add Staff'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStaff
