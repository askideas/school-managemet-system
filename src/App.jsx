import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './Pages/Dashboard/Dashboard'
import { schoolMenuItems } from './SMSData'
import AddTeacher from './Pages/AddTeacher/AddTeacher'
import Teachers from './Pages/Teachers/Teachers'
import TeacherDetails from './Pages/TeacherDetails/TeacherDetails'
import Classes from './Pages/Classes/Classes'
import Sections from './Pages/Sections/Sections'
import Subjects from './Pages/Subjects/Subjects'
import NoticeBoard from './Pages/NoticeBoard/NoticeBoard'
import Exams from './Pages/Exams/Exams'
import ExamResults from './Pages/ExamResults/ExamResults'
import StudentFee from './Pages/StudentFee/StudentFee'
import Expenses from './Pages/Expenses/Expenses'
import Payroll from './Pages/Payroll/Payroll'
import FinanceReport from './Pages/FinanceReport/FinanceReport'
import Slots from './Pages/Slots/Slots'
import AddStaff from './Pages/AddStaff/AddStaff'
import ManageStaff from './Pages/ManageStaff/ManageStaff'

// Component to display page title based on route
const TopBar = () => {
  const location = useLocation()
  
  const getPageTitle = () => {
    const path = location.pathname
    const titleMap = {
      '/': 'Dashboard',
      '/addteacher': 'Add Teacher',
      '/addstaff': 'Add Staff',
      '/staff': 'Manage Staff',
      '/teachers': 'Teachers',
      '/classes': 'Classes',
      '/sections': 'Sections',
      '/subjects': 'Subjects',
      '/exams': 'Exams',
      '/examresults': 'Exam Results',
      '/noticeboard': 'Notice Board',
      '/studentfee': 'Student Fee',
      '/expenses': 'Expenses',
      '/payroll': 'Payroll',
      '/financereport': 'Finance Report',
      '/slots': 'Slots'
    }
    
    return titleMap[path] || 'School Management System'
  }

  return (
    <div className="top-bar-container">
      <h1>{getPageTitle()}</h1>
      <div className="user-details">
        <span style={{ color: 'white', fontWeight: '600' }}>A</span>
        <div className="user-active">
          <span></span>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [activeAccordion, setActiveAccordion] = useState('billing')

  return (
    <BrowserRouter>
      <div className='sms-main-component'>
        {/* Sidebar */}
        <div className="side-bar-menu">
          <div className="side-bar-header-logo">
            <div className="logo-container">
              <h4 className="school-logo">LETMEDO</h4>
              <p className="logo-subtitle">School Management System</p>
            </div>
          </div>

          <div className="lmd-sms-menu-items">
            <nav className="sidebar-nav">
              {schoolMenuItems.map((item) => (
                <div key={item.id} className="nav-item-container">
                  {!item.hasSubmenu ? (
                    <div className="nav-item-simple">
                      <NavLink to={item.link} className="nav-link-simple">
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.label}</span>
                        <span className="nav-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </NavLink>
                    </div>
                  ) : (
                    <div className="accordion-item-custom">
                      <div className="accordion-header-custom">
                        <button
                          className={`accordion-button-custom ${
                            activeAccordion === item.id ? 'active' : ''
                          }`}
                          onClick={() =>
                            setActiveAccordion(activeAccordion === item.id ? null : item.id)
                          }
                        >
                          <span className="nav-icon">{item.icon}</span>
                          <span className="nav-text">{item.label}</span>
                          <span
                            className={`accordion-arrow ${
                              activeAccordion === item.id ? 'expanded' : ''
                            }`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M6 9L12 15L18 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                      {activeAccordion === item.id && (
                        <div className="accordion-body-custom">
                          {item.subItems.map((subItem) => (
                            <NavLink key={subItem.id} to={subItem.link} className="sub-menu-link">
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <TopBar />

          <div className="routes-main-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/addteacher" element={<AddTeacher />} />
              <Route path="/addstaff" element={<AddStaff />} />
              <Route path="/staff" element={<ManageStaff />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/teachers/:teacherId" element={<TeacherDetails />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/sections" element={<Sections />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/examresults" element={<ExamResults />} />
              <Route path="/noticeboard" element={<NoticeBoard />} />
              <Route path="/studentfee" element={<StudentFee />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/financereport" element={<FinanceReport />} />
              <Route path="/slots" element={<Slots />} />
            </Routes>
          </div>
        </div>

        {/* Custom Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          closeButton={false}
          limit={1}
          style={{
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            minWidth: '400px',
            maxWidth: '600px'
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
