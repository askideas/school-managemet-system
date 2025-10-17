import React, { useState } from 'react'
import './AddStaff.css'
import { doc, setDoc } from 'firebase/firestore'
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Save, X } from 'lucide-react'
import { db } from '../../firebase'

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
      const staffData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        staffType: formData.staffType,
        department: formData.department,
        designation: formData.designation,
        qualification: formData.qualification,
        experience: formData.experience,
        joiningDate: formData.joiningDate,
        salary: formData.salary,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        emergencyContactName: formData.emergencyContactName,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        createdAt: new Date().toISOString(),
        status: 'active'
      }

      await setDoc(doc(db, 'Staff', formData.mobile), staffData)
      console.log('Staff saved successfully!')

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

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error details:', err)
      setError(`Failed to add staff: ${err.message}`)
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
    setError('')
    setSuccess('')
  }

  return (
    <div className="add-staff-container">
      {/* Fixed Alert Messages */}
      {error && (
        <div className="alert alert-danger alert-fixed">
          <X size={18} />
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-fixed">
          <Save size={18} />
          <span>{success}</span>
          <button className="alert-close" onClick={() => setSuccess('')}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="add-staff-header">
        <h2>Add New Staff</h2>
        <p>Fill in the details below to add a new staff member</p>
      </div>

      <form onSubmit={handleSubmit} className="add-staff-form">
        {/* Personal Information */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
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
              <label>Email <span className="required">*</span></label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
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
                <Phone size={18} className="input-icon" />
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
                <Calendar size={18} className="input-icon" />
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

        {/* Professional Information */}
        <div className="form-section">
          <h3 className="section-title">Professional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Staff Type <span className="required">*</span></label>
              <div className="input-with-icon">
                <Briefcase size={18} className="input-icon" />
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
                <Calendar size={18} className="input-icon" />
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
                <Phone size={18} className="input-icon" />
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
