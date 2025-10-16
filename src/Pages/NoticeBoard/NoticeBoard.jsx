import React from 'react'
import './NoticeBoard.css'
import { User, Calendar } from 'lucide-react'

const NoticeBoard = () => {
  return (
    <>
      <div className="top-bar-container">
        <h1>Notice Board</h1>
        <div className="user-details">
          <User style={{ color: '#ffffff', width: '20px' }} />
          <span className="user-active"><span></span></span>
        </div>
      </div>

      <div className="notice-main-container">
        {/* Left Side - Create Notice */}
        <div className="create-notice-container">
          <h2>Create A Notice</h2>

          <div className="input-con">
            <label>Title</label>
            <input type="text" placeholder="Enter notice title" />
          </div>

          <div className="input-con">
            <label>Details</label>
            <textarea placeholder="Enter notice details"></textarea>
          </div>

          <div className="input-con icon-input">
            <label>Posted By</label>
            <div className="input-icon">
              <input type="text" placeholder="Enter name" />
              <User className="input-icon-right" size={16} />
            </div>
          </div>

          <div className="input-con icon-input">
            <label>Date</label>
            <div className="input-icon">
              <input type="date" />
              <Calendar className="input-icon-right" size={16} />
            </div>
          </div>

          <div className="notice-form-actions">
            <button className="save-btn">Save</button>
            <button className="reset-btn">Reset</button>
          </div>
        </div>

        {/* Right Side - Notice List */}
        <div className="notice-board-container">
          <h2>Notice Board</h2>

          <div className="search-container">
            <input type="text" placeholder="Search by Date ..." />
            <input type="text" placeholder="Search by Title ..." />
            <button className="search-btn">Search</button>
          </div>

          <div className="notice-list">
            <div className="notice-item">
              <div className="notice-date green">16 June, 2019</div>
              <p className="notice-text">
                Great School Great School manage menesom text of the printing Great School manage menesom text of the printing.
              </p>
              <p className="notice-meta">Jennyfar Lopez / 5 min ago</p>
            </div>

            <div className="notice-item">
              <div className="notice-date yellow">16 June, 2019</div>
              <p className="notice-text">
                Great School Great School manage menesom text of the printing Great School manage menesom text of the printing.
              </p>
              <p className="notice-meta">Jennyfar Lopez / 5 min ago</p>
            </div>

            <div className="notice-item">
              <div className="notice-date pink">16 June, 2019</div>
              <p className="notice-text">
                Great School Great School manage menesom text of the printing Great School manage menesom text of the printing.
              </p>
              <p className="notice-meta">Jennyfar Lopez / 5 min ago</p>
            </div>

            <div className="notice-item">
              <div className="notice-date green">16 June, 2019</div>
              <p className="notice-text">
                Great School Great School manage menesom text of the printing Great School manage menesom text of the printing.
              </p>
              <p className="notice-meta">Jennyfar Lopez / 5 min ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoticeBoard
