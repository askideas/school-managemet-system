import React from 'react'
import './AddTeacher.css'
import { GraduationCap, Landmark, User, UserPlus } from 'lucide-react'
import Photopreview from '../../assets/photo-preview.png'
import ImageUploadPreview from '../../assets/image-upload-preview.png'

const AddTeacher = () => {
  return (
    <>
      <div className="top-bar-container">
        <h1>Add Teacher</h1>
        <div className="user-details">
          <User style={{color: '#ffffff', width: '20px'}} />
          <span className="user-active"><span></span></span>
        </div>
      </div>
      {/* Personal Details Section */}

      <div className="add-teacher-personal-details-form-container add-teacher-container">
        <div className="heading-con">
          <h1><User className='icon' /> Personal Details</h1>
        </div>

        <div className="teacher-input-container">
          <div className="teacher-input-con">
            <label htmlFor="">First name <span>*</span></label>
            <input type="text" placeholder='First name' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Last name <span>*</span></label>
            <input type="text" placeholder='Last name' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Email <span>*</span></label>
            <input type="email" placeholder='Email' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Phone number <span>*</span></label>
            <input
              type="number"
              placeholder='Phone number'
              onWheel={(e) => e.target.blur()}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10)
              }}
            />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Date of Birth <span>*</span></label>
            <input type="date" placeholder='Date of Birth' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Address <span>*</span></label>
            <input type="text" placeholder='Address' />
          </div>

          <div className="teacher-upload-con">
            <label htmlFor="">Photo <span>*</span></label>
            <div className="preview-con">
              <img src={Photopreview} alt="" />
            </div>
            <div className="upload-actions">
              <button className="upload-btn">Choose file</button>
              <button className="upload-cancel">Remove</button>
            </div>
          </div>

          <div className="teacher-upload-con">
            <label htmlFor="">Governament ID <span>*</span></label>
            <div className="preview-con">
              <img src={ImageUploadPreview} alt="" />
            </div>
            <div className="upload-actions">
              <button className="upload-btn">Choose file</button>
              <button className="upload-cancel">Remove</button>
            </div>
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Govername ID Number <span>*</span></label>
            <input type="text" placeholder='Governament ID Number' />
          </div>

        </div>
      </div>

      {/* Professional Details Section */}
      <div className="add-teacher-professional-details-form-container add-teacher-container">
        <div className="heading-con">
          <h1><GraduationCap className='icon' /> Professional Details</h1>
        </div>

        <div className="teacher-input-container">
          <div className="teacher-input-con">
            <label htmlFor="roles">Select Role</label>
            <input list="roleslist" id="roles" name="roles" placeholder="Role" />
            <datalist id="roleslist">
              <option value="Principal" />
              <option value="Vice Principal" />
              <option value="Incharge" />
              <option value="Class Teacher" />
              <option value="PET" />
            </datalist>
          </div>

          <div className="teacher-input-con">
            <label htmlFor="subject">Select Subject</label>
            <input list="subjectslist" id="subjects" name="subjects" placeholder="Select Subject" />
            <datalist id="subjectslist">
              <option value="Telugu" />
              <option value="Hindi" />
              <option value="English" />
              <option value="Matematics" />
              <option value="General Science" />
              <option value="Social Studies" />
            </datalist>
          </div>
        </div>
      </div>

      {/* Qualification Section */}
      <div className="add-teacher-qualification-details-form-container add-teacher-container">
        <div className="heading-con">
          <h1><GraduationCap className='icon' /> Qualification</h1>
        </div>

        <div className="teacher-input-container">
          <div className="teacher-input-con">
            <label htmlFor="">Highest Qualification <span>*</span></label>
            <input type="text" placeholder='Highest Qualification' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Passedout Year <span>*</span></label>
            <input type="text" placeholder='Passedout Year' />
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="add-teacher-bank-details-form-container add-teacher-container">
        <div className="heading-con">
          <h1><Landmark className='icon' /> Bank Details</h1>
        </div>

        <div className="teacher-input-container">
          <div className="teacher-input-con">
            <label htmlFor="">Bank Name <span>*</span></label>
            <input type="text" placeholder='Bank Name' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">Account Number <span>*</span></label>
            <input type="text" placeholder='Account Number' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">IFSC Code <span>*</span></label>
            <input type="text" placeholder='IFSC Code' />
          </div>

          <div className="teacher-input-con">
            <label htmlFor="">UPI Id <span>*</span></label>
            <input type="text" placeholder='UPI Id' />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="actions-con">
        <button className="save-teacher-btn">
          <UserPlus className='icon' /> Save Teacher
        </button>
      </div>
    </>
  )
}

export default AddTeacher
