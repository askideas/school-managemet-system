import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
import { schoolMenuItems } from './SMSData'
import AddTeacher from './Pages/AddTeacher/AddTeacher'
import Teachers from './Pages/Teachers/Teachers'

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
          <div className="top-bar-content-container">
            {/* Optional top bar content */}
          </div>

          <div className="routes-main-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/addteacher" element={<AddTeacher />} />
              <Route path="/teachers" element={<Teachers />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
