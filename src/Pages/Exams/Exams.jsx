import React from 'react'
import './Exams.css'
import { Calendar, Clock } from 'lucide-react'

const Exams = () => {
    return (
        <>
            <div className="top-bar-container">
                <h1>Exams</h1>
                <div className="user-details">
                    <User style={{ color: '#ffffff', width: '20px' }} />
                    <span className="user-active"><span></span></span>
                </div>
            </div>

            <div className="exams-container">
                {/* Left Section - Add New Exam */}
                <div className="add-exam-container">
                    <h2>Add New Exam</h2>

                    <label>Exam Name</label>
                    <input type="text" placeholder="Enter exam name" />

                    <label>Subject Type *</label>
                    <select>
                        <option>Please Select</option>
                        <option>Mathematics</option>
                        <option>English</option>
                        <option>Chemistry</option>
                    </select>

                    <label>Select Class *</label>
                    <select>
                        <option>Please Select</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>

                    <label>Select Section</label>
                    <select>
                        <option>Please Select</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                    </select>

                    <label>Select Time</label>
                    <div className="input-icon">
                        <input type="time" />
                        <Clock className="input-icon-symbol" size={16} />
                    </div>

                    <label>Select Date</label>
                    <div className="input-icon">
                        <input type="date" />
                        <Calendar className="input-icon-symbol" size={16} />
                    </div>

                    <div className="exam-btn-group">
                        <button className="save-btn">Save</button>
                        <button className="reset-btn">Reset</button>
                    </div>
                </div>

                {/* Right Section - All Exam Schedule */}
                <div className="exam-schedule-container">
                    <h2>All Exam Schedule</h2>

                    <div className="exam-search-bar">
                        <input type="text" placeholder="Search by Exam ..." />
                        <input type="text" placeholder="Search by Subject ..." />
                        <input type="text" placeholder="Search by Date ..." />
                        <button className="search-btn">Search</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Subject</th>
                                <th>Class</th>
                                <th>Section</th>
                                <th>Time</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i}>
                                    <td>Class Test</td>
                                    <td>{['Mathematics', 'English', 'Chemistry'][i % 3]}</td>
                                    <td>4</td>
                                    <td>A</td>
                                    <td>10.00 am - 11.00 am</td>
                                    <td>20/06/2019</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    )
}

export default Exams
