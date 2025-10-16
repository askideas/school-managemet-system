import React from 'react'
import './Teachers.css'
import { Eye, User } from 'lucide-react'
import Photopreview from '../../assets/user-avatar-emplyee.svg'
import { NavLink } from 'react-router-dom'

const Teachers = () => {
  return (
    <>
      <div className="top-bar-container">
        <h1>Teachers</h1>
        <div className="user-details">
          <User style={{color: '#ffffff', width: '20px'}} />
          <span className="user-active"><span></span></span>
        </div>
      </div>

      <div className="teachers-list-container">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Photo</th>
              <th scope="col">Name</th>
              <th scope="col">Gender</th>
              <th scope="col">Subject</th>
              <th scope="col">Class</th>
              <th scope="col">Section</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">SMS202501</th>
              <td><img src={Photopreview} alt="" style={{width: '30px', height: '30px'}} /></td>
              <td>Arumulla Siva Krishna</td>
              <td>Male</td>
              <td>Telugu</td>
              <td>7</td>
              <td>A</td>
              <td>+91 9398638314</td>
              <td>arumullasivakrishna6@gmail.com</td>
              <td>Janasakthi Nagar, Vedayapalem, Nellore-4</td>
              <td><NavLink to='/teachers/1'><Eye className='icon' /></NavLink></td>
            </tr>

            <tr>
              <th scope="row">SMS202501</th>
              <td><img src={Photopreview} alt="" style={{width: '30px', height: '30px'}} /></td>
              <td>Arumulla Siva Krishna</td>
              <td>Male</td>
              <td>Telugu</td>
              <td>7</td>
              <td>A</td>
              <td>+91 9398638314</td>
              <td>arumullasivakrishna6@gmail.com</td>
              <td>Janasakthi Nagar, Vedayapalem, Nellore-4</td>
              <td><NavLink to='/teachers/1'><Eye className='icon' /></NavLink></td>
            </tr>

            <tr>
              <th scope="row">SMS202501</th>
              <td><img src={Photopreview} alt="" style={{width: '30px', height: '30px'}} /></td>
              <td>Arumulla Siva Krishna</td>
              <td>Male</td>
              <td>Telugu</td>
              <td>7</td>
              <td>A</td>
              <td>+91 9398638314</td>
              <td>arumullasivakrishna6@gmail.com</td>
              <td>Janasakthi Nagar, Vedayapalem, Nellore-4</td>
              <td><NavLink to='/teachers/1'><Eye className='icon' /></NavLink></td>
            </tr>

            <tr>
              <th scope="row">SMS202501</th>
              <td><img src={Photopreview} alt="" style={{width: '30px', height: '30px'}} /></td>
              <td>Arumulla Siva Krishna</td>
              <td>Male</td>
              <td>Telugu</td>
              <td>7</td>
              <td>A</td>
              <td>+91 9398638314</td>
              <td>arumullasivakrishna6@gmail.com</td>
              <td>Janasakthi Nagar, Vedayapalem, Nellore-4</td>
              <td><NavLink to='/teachers/1'><Eye className='icon' /></NavLink></td>
            </tr>

          </tbody>
        </table>
      </div>
    </>
  )
}

export default Teachers