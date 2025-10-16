import React from 'react'
import './TeacherDetails.css'
import { Landmark, Mail, MapPin, Phone, QrCode, User } from 'lucide-react'
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

                <div className="bank-details-section">
                    <h1>Bank Details</h1>
                    <div className="bank-details-grid-con">
                        <div className="icon-container">
                            <div className="icon-con">
                                <Landmark className='icon' />
                            </div>
                            <div className="icon-con-details">
                                <p className="sub">Bank Name</p>
                                <p className="item">Axis Bank</p>
                            </div>
                        </div>

                        <div className="icon-container">
                            <div className="icon-con">
                                <Landmark className='icon' />
                            </div>
                            <div className="icon-con-details">
                                <p className="sub">Account Number</p>
                                <p className="item">984563214578</p>
                            </div>
                        </div>

                        <div className="icon-container">
                            <div className="icon-con">
                                <Landmark className='icon' />
                            </div>
                            <div className="icon-con-details">
                                <p className="sub">IFSC Code</p>
                                <p className="item">AXIS0000123</p>
                            </div>
                        </div>

                        <div className="icon-container">
                            <div className="icon-con">
                                <QrCode className='icon' />
                            </div>
                            <div className="icon-con-details">
                                <p className="sub">UPI Id</p>
                                <p className="item">9874563214@ybl</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="teacher-details-right-section">
                <div className="professional-details-container">
                    <h1>Professional Details</h1>
                    <p><strong>Subject : </strong><span>Mathematics</span></p>
                    <p><strong>Class : </strong><span>10</span></p>
                    <p><strong>Section : </strong><span>A</span></p>
                </div>

                <div className="qualifications-details-container">
                    <h1>Qualification Details</h1>
                    <p><strong>Qualification : </strong><span>MSC</span></p>
                    <p><strong>Expert : </strong><span>Physics</span></p>
                    <p><strong>Passed out Year : </strong><span>2002</span></p>
                </div>

                <div className="additional-details-container">
                    <h1>Additional Details</h1>
                    <p><strong>Date of Birth : </strong><span>24th Aug, 1985</span></p>
                    <p><strong>Father Name : </strong><span>John Doe</span></p>
                    <p><strong>Father Occupation : </strong><span>Farmer</span></p>
                    <p><strong>Mother Name : </strong><span>Lakshmi</span></p>
                    <p><strong>Mother Occupation : </strong><span>House Wife</span></p>
                </div>
            </div>
        </div>
    </>
  )
}

export default TeacherDetails