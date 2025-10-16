import React from 'react'
import './Classes.css'
import { User } from 'lucide-react'

const Classes = () => {
  return (
    <>
      <div className="top-bar-container">
        <h1>Classes</h1>
        <div className="user-details">
          <User style={{ color: '#ffffff', width: '20px' }} />
          <span className="user-active"><span></span></span>
        </div>
      </div>

      <div className="classes-main-container">
        <div className="classes-form-container">
          <h1 className='add-class-heading'>Add New Class</h1>

          <div className="input-class-con">
            <label htmlFor="">Class ID <span>*</span> </label>
            <input type="text" placeholder='Class ID' disabled />
          </div>

          <div className="input-class-con">
            <label htmlFor="">Class Name <span>*</span> </label>
            <input type="text" placeholder='Class name' />
          </div>

          <div className="class-form-actions-con">
            <button className="reset-form-container">Reset</button>
            <button className="add-class-btn">Add Class</button>
          </div>
        </div>

        <div className="classes-list-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">S.no</th>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">1</th><td>class_play</td><td>Play Class</td></tr>
              <tr><th scope="row">2</th><td>class_lkg</td><td>LKG</td></tr>
              <tr><th scope="row">3</th><td>class_ukg</td><td>UKG</td></tr>
              <tr><th scope="row">4</th><td>class_1</td><td>First Class</td></tr>
              <tr><th scope="row">5</th><td>class_2</td><td>Second Class</td></tr>
              <tr><th scope="row">6</th><td>class_3</td><td>Third Class</td></tr>
              <tr><th scope="row">7</th><td>class_4</td><td>Fourth Class</td></tr>
              <tr><th scope="row">8</th><td>class_5</td><td>Fifth Class</td></tr>
              <tr><th scope="row">9</th><td>class_6</td><td>Sixth Class</td></tr>
              <tr><th scope="row">10</th><td>class_7</td><td>Seventh Class</td></tr>
              <tr><th scope="row">11</th><td>class_8</td><td>Eighth Class</td></tr>
              <tr><th scope="row">12</th><td>class_9</td><td>Ninth Class</td></tr>
              <tr><th scope="row">13</th><td>class_10</td><td>Tenth Class</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Classes
