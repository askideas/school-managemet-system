import React from 'react'
import './Subjects.css'
import { User } from 'lucide-react'

const Subjects = () => {
  return (
    <>
      <div className="top-bar-container">
        <h1>Subjects</h1>
        <div className="user-details">
          <User style={{ color: '#ffffff', width: '20px' }} />
          <span className="user-active"><span></span></span>
        </div>
      </div>

      <div className="subjects-main-container">
        <div className="subjects-form-container">
          <h1 className='add-subject-heading'>Add New Subject</h1>

          <div className="input-subject-con">
            <label>Subject ID <span>*</span></label>
            <input type="text" placeholder='Subject ID' disabled />
          </div>

          <div className="input-subject-con">
            <label>Subject Name <span>*</span></label>
            <input type="text" placeholder='Subject name' />
          </div>

          <div className="subject-form-actions-con">
            <button className="reset-form-container">Reset</button>
            <button className="add-subject-btn">Add Subject</button>
          </div>
        </div>

        <div className="subjects-list-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">S.no</th>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">1</th><td>sub_telugu</td><td>Telugu</td></tr>
              <tr><th scope="row">2</th><td>sub_hindi</td><td>Hindi</td></tr>
              <tr><th scope="row">3</th><td>sub_english</td><td>English</td></tr>
              <tr><th scope="row">4</th><td>sub_math</td><td>Mathematics</td></tr>
              <tr><th scope="row">5</th><td>sub_gen_sci</td><td>General Science</td></tr>
              <tr><th scope="row">6</th><td>sub_physics</td><td>Physics</td></tr>
              <tr><th scope="row">7</th><td>sub_chem</td><td>Chemistry</td></tr>
              <tr><th scope="row">8</th><td>sub_social</td><td>Social Studies</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Subjects
