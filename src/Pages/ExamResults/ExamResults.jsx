import React from 'react'
import './ExamResults.css'
import { User, BookOpen, Calendar, Award } from 'lucide-react'

const ExamResults = () => {
  return (
    <div className="exam-results-container">
      {/* Left Section - Add Result */}
      <div className="add-result-container">
        <h2>Add Exam Result</h2>

        <label>Student Name</label>
        <div className="input-icon">
          <input type="text" placeholder="Enter student name" />
          <User className="input-icon-symbol" size={16} />
        </div>

        <label>Exam Name</label>
        <div className="input-icon">
          <input type="text" placeholder="Enter exam name" />
          <BookOpen className="input-icon-symbol" size={16} />
        </div>

        <label>Subject</label>
        <select>
          <option>Please Select</option>
          <option>Mathematics</option>
          <option>English</option>
          <option>Chemistry</option>
          <option>Physics</option>
        </select>

        <label>Total Marks</label>
        <input type="number" placeholder="Enter total marks" />

        <label>Marks Obtained</label>
        <input type="number" placeholder="Enter marks obtained" />

        <label>Exam Date</label>
        <div className="input-icon">
          <input type="date" />
          <Calendar className="input-icon-symbol" size={16} />
        </div>

        <div className="exam-btn-group">
          <button className="save-btn">Save</button>
          <button className="reset-btn">Reset</button>
        </div>
      </div>

      {/* Right Section - Results Table */}
      <div className="result-list-container">
        <h2>Exam Results</h2>

        <div className="result-search-bar">
          <input type="text" placeholder="Search by Student ..." />
          <input type="text" placeholder="Search by Exam ..." />
          <button className="search-btn">Search</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Exam Name</th>
              <th>Subject</th>
              <th>Total Marks</th>
              <th>Marks Obtained</th>
              <th>Percentage</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Rahul Sharma', exam: 'Mid Term', subject: 'Mathematics', total: 100, obtained: 85, date: '2025-09-10' },
              { name: 'Priya Verma', exam: 'Mid Term', subject: 'English', total: 100, obtained: 74, date: '2025-09-10' },
              { name: 'Amit Yadav', exam: 'Mid Term', subject: 'Chemistry', total: 100, obtained: 66, date: '2025-09-10' },
              { name: 'Sneha Gupta', exam: 'Mid Term', subject: 'Physics', total: 100, obtained: 92, date: '2025-09-10' },
            ].map((res, i) => {
              const percentage = ((res.obtained / res.total) * 100).toFixed(1)
              const status = percentage >= 35 ? 'Pass' : 'Fail'
              return (
                <tr key={i}>
                  <td>{res.name}</td>
                  <td>{res.exam}</td>
                  <td>{res.subject}</td>
                  <td>{res.total}</td>
                  <td>{res.obtained}</td>
                  <td>{percentage}%</td>
                  <td>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      <Award size={14} /> {status}
                    </span>
                  </td>
                  <td>{res.date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExamResults
