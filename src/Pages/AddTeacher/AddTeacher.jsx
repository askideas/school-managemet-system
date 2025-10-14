import React from 'react'
import './AddTeacher.css'
import { GraduationCap, User, UserPlus } from 'lucide-react'

const AddTeacher = () => {
  return (
    <>
      {/* Personal Details Section */}
      <div className="add-teacher-heading-container"></div>

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
