import React from 'react'
import './Sections.css'
import { User } from 'lucide-react'

const Sections = () => {
  return (
    <>
      <div className="top-bar-container">
        <h1>Sections</h1>
        <div className="user-details">
          <User style={{ color: '#ffffff', width: '20px' }} />
          <span className="user-active"><span></span></span>
        </div>
      </div>

      <div className="sections-main-container">
        <div className="sections-form-container">
          <h1 className='add-section-heading'>Add New Section</h1>

          <div className="input-section-con">
            <label>Section ID <span>*</span></label>
            <input type="text" placeholder='Section ID' disabled />
          </div>

          <div className="input-section-con">
            <label>Section Name <span>*</span></label>
            <input type="text" placeholder='Section name' />
          </div>

          <div className="section-form-actions-con">
            <button className="reset-form-container">Reset</button>
            <button className="add-section-btn">Add Section</button>
          </div>
        </div>

        <div className="sections-list-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">S.no</th>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">1</th><td>section_a</td><td>Section A</td></tr>
              <tr><th scope="row">2</th><td>section_b</td><td>Section B</td></tr>
              <tr><th scope="row">3</th><td>section_c</td><td>Section C</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Sections
