import React from 'react'
import './TeacherDetails.css'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import TeacherDetailsAvatar from '../../assets/teacher-details-avatar.jpg'

const TeacherDetails = () => {
  return (
    <>
        <div className="top-bar-container">
            <h1>Arumulla Siva Krishna</h1>
            <div className="user-details">
            <User style={{color: '#ffffff', width: '20px'}} />
            <span className="user-active"><span></span></span>
            </div>
        </div>

        <div className="teacher-details-container">
            <div className="teacher-details-left-section">
                <div className="personal-details-section">
                    <div className="profile-avatar-con">
                        <div className="user-pic-con">
                            <img src={TeacherDetailsAvatar} alt="" />
                        </div>
                    </div>
                    <div className="profile-details-container">
                        <h1 className="teacher-name">Arumulla Siva Krishna</h1>
                        <h2>Science Teacher</h2>
                        <div className="details-grid-con">
                            <div className="icon-container">
                                <div className="icon-con">
                                    <User className='icon' />
                                </div>
                                <div className="icon-con-details">
                                    <p className="sub">Parents</p>
                                    <p className="item">John Doe</p>
                                </div>
                            </div>

                            <div className="icon-container">
                                <div className="icon-con">
                                    <Phone className='icon' />
                                </div>
                                <div className="icon-con-details">
                                    <p className="sub">Phone number</p>
                                    <p className="item">+91 9398638314</p>
                                </div>
                            </div>

                            <div className="icon-container">
                                <div className="icon-con">
                                    <Mail className='icon' />
                                </div>
                                <div className="icon-con-details">
                                    <p className="sub">Email</p>
                                    <p className="item">arumullasivakrishna6@gmail.com</p>
                                </div>
                            </div>

                            <div className="icon-container">
                                <div className="icon-con">
                                    <MapPin className='icon' />
                                </div>
                                <div className="icon-con-details">
                                    <p className="sub">Address</p>
                                    <p className="item">Janasakthi Nagar, Vedayapalem, Nellore-4</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="teacher-details-right-section">

            </div>
        </div>
    </>
  )
}

export default TeacherDetails