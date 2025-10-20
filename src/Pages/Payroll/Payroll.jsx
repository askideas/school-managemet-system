import React, { useState, useEffect } from 'react'
import './Payroll.css'
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { 
  Search, 
  Filter, 
  Calendar, 
  Save, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calculator,
  FileText,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const Payroll = () => {
  const [staffList, setStaffList] = useState([])
  const [payrollData, setPayrollData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStaffType, setFilterStaffType] = useState('')
  
  // Current payroll month/year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  // Analytics states
  const [analyticsMonth, setAnalyticsMonth] = useState(new Date().getMonth() + 1)
  const [analyticsYear, setAnalyticsYear] = useState(new Date().getFullYear())
  const [analyticsData, setAnalyticsData] = useState({
    totalSalary: 0,
    totalBonus: 0,
    totalMiscellaneous: 0,
    totalDeductions: 0,
    netPayroll: 0,
    staffCount: 0
  })
  const [previousMonthData, setPreviousMonthData] = useState({})

  useEffect(() => {
    fetchStaffData()
  }, [])

  useEffect(() => {
    loadPayrollData()
  }, [currentMonth, currentYear])

  useEffect(() => {
    loadAnalyticsData()
  }, [analyticsMonth, analyticsYear])

  const fetchStaffData = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Staff'))
      const staffData = []
      querySnapshot.forEach((doc) => {
        const staff = { id: doc.id, ...doc.data() }
        staffData.push(staff)
      })
      setStaffList(staffData)
      initializePayrollData(staffData)
    } catch (error) {
      console.error('Error fetching staff:', error)
      showErrorToast('Failed to fetch staff data')
    } finally {
      setLoading(false)
    }
  }

  const initializePayrollData = (staffData) => {
    const initialPayroll = staffData.map(staff => ({
      staffId: staff.id,
      staffName: `${staff.firstName} ${staff.lastName}`,
      department: staff.department || 'General',
      staffType: staff.staffType || 'Staff',
      basicSalary: parseFloat(staff.salary) || 0,
      bonus: 0,
      miscellaneous: 0,
      deductions: 0,
      netSalary: parseFloat(staff.salary) || 0,
      workingDays: 30,
      actualDays: 30,
      status: 'pending'
    }))
    setPayrollData(initialPayroll)
  }

  const loadPayrollData = async () => {
    try {
      const payrollId = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
      const querySnapshot = await getDocs(
        query(collection(db, 'Payroll'), where('payrollId', '==', payrollId))
      )
      
      if (!querySnapshot.empty) {
        const payrollDoc = querySnapshot.docs[0]
        const savedPayroll = payrollDoc.data().staffPayroll || []
        setPayrollData(savedPayroll)
      }
    } catch (error) {
      console.error('Error loading payroll:', error)
    }
  }

  const loadAnalyticsData = async () => {
    try {
      const payrollId = `${analyticsYear}-${analyticsMonth.toString().padStart(2, '0')}`
      const querySnapshot = await getDocs(
        query(collection(db, 'Payroll'), where('payrollId', '==', payrollId))
      )
      
      if (!querySnapshot.empty) {
        const payrollDoc = querySnapshot.docs[0]
        const staffPayroll = payrollDoc.data().staffPayroll || []
        
        const analytics = staffPayroll.reduce((acc, staff) => ({
          totalSalary: acc.totalSalary + staff.basicSalary,
          totalBonus: acc.totalBonus + staff.bonus,
          totalMiscellaneous: acc.totalMiscellaneous + staff.miscellaneous,
          totalDeductions: acc.totalDeductions + staff.deductions,
          netPayroll: acc.netPayroll + staff.netSalary,
          staffCount: acc.staffCount + 1
        }), {
          totalSalary: 0,
          totalBonus: 0,
          totalMiscellaneous: 0,
          totalDeductions: 0,
          netPayroll: 0,
          staffCount: 0
        })
        
        setAnalyticsData(analytics)
      } else {
        setAnalyticsData({
          totalSalary: 0,
          totalBonus: 0,
          totalMiscellaneous: 0,
          totalDeductions: 0,
          netPayroll: 0,
          staffCount: 0
        })
      }

      // Load previous month for comparison
      const prevMonth = analyticsMonth === 1 ? 12 : analyticsMonth - 1
      const prevYear = analyticsMonth === 1 ? analyticsYear - 1 : analyticsYear
      const prevPayrollId = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`
      
      const prevQuerySnapshot = await getDocs(
        query(collection(db, 'Payroll'), where('payrollId', '==', prevPayrollId))
      )
      
      if (!prevQuerySnapshot.empty) {
        const prevPayrollDoc = prevQuerySnapshot.docs[0]
        const prevStaffPayroll = prevPayrollDoc.data().staffPayroll || []
        
        const prevAnalytics = prevStaffPayroll.reduce((acc, staff) => ({
          totalSalary: acc.totalSalary + staff.basicSalary,
          totalBonus: acc.totalBonus + staff.bonus,
          totalMiscellaneous: acc.totalMiscellaneous + staff.miscellaneous,
          totalDeductions: acc.totalDeductions + staff.deductions,
          netPayroll: acc.netPayroll + staff.netSalary,
          staffCount: acc.staffCount + 1
        }), {
          totalSalary: 0,
          totalBonus: 0,
          totalMiscellaneous: 0,
          totalDeductions: 0,
          netPayroll: 0,
          staffCount: 0
        })
        
        setPreviousMonthData(prevAnalytics)
      } else {
        setPreviousMonthData({})
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const handleInputChange = (staffId, field, value) => {
    setPayrollData(prev => prev.map(staff => {
      if (staff.staffId === staffId) {
        const updatedStaff = { ...staff, [field]: parseFloat(value) || 0 }
        
        // Calculate net salary
        const netSalary = (updatedStaff.basicSalary * (updatedStaff.actualDays / updatedStaff.workingDays)) + 
                         updatedStaff.bonus + 
                         updatedStaff.miscellaneous - 
                         updatedStaff.deductions
        
        return { ...updatedStaff, netSalary: Math.max(0, netSalary) }
      }
      return staff
    }))
  }

  const savePayroll = async () => {
    try {
      setSaving(true)
      const payrollId = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
      
      const payrollDocument = {
        payrollId,
        month: currentMonth,
        year: currentYear,
        monthName: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' }),
        staffPayroll: payrollData.map(staff => ({
          ...staff,
          status: 'processed'
        })),
        totalStaff: payrollData.length,
        totalAmount: payrollData.reduce((sum, staff) => sum + staff.netSalary, 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'Payroll', payrollId), payrollDocument)
      
      setPayrollData(prev => prev.map(staff => ({ ...staff, status: 'processed' })))
      showSuccessToast(`Payroll saved successfully for ${payrollDocument.monthName} ${currentYear}`)
      
      // Refresh analytics if viewing current month
      if (analyticsMonth === currentMonth && analyticsYear === currentYear) {
        loadAnalyticsData()
      }
    } catch (error) {
      console.error('Error saving payroll:', error)
      showErrorToast('Failed to save payroll')
    } finally {
      setSaving(false)
    }
  }

  const getFilteredStaff = () => {
    return payrollData.filter(staff => {
      const matchesSearch = searchTerm === '' || 
        staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDepartment = filterDepartment === '' || staff.department === filterDepartment
      const matchesStaffType = filterStaffType === '' || staff.staffType === filterStaffType
      
      return matchesSearch && matchesDepartment && matchesStaffType
    })
  }

  const getDepartments = () => {
    const departments = [...new Set(payrollData.map(staff => staff.department))]
    return departments.filter(dept => dept && dept !== '')
  }

  const getStaffTypes = () => {
    const types = [...new Set(payrollData.map(staff => staff.staffType))]
    return types.filter(type => type && type !== '')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="payroll-container">
      {/* Header Section */}
      <div className="payroll-header">
        <div className="payroll-header-left">
          <h1>Payroll Management</h1>
          <p>Manage staff salaries and payroll processing</p>
        </div>
        <div className="payroll-header-actions">
          <button className="payroll-refresh-btn" onClick={fetchStaffData} disabled={loading}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            className="payroll-save-btn" 
            onClick={savePayroll}
            disabled={saving || payrollData.length === 0}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Payroll'}
          </button>
        </div>
      </div>

      {/* Current Payroll Controls */}
      <div className="payroll-controls">
        <div className="payroll-month-selector">
          <label>Payroll Month/Year:</label>
          <div className="month-year-inputs">
            <select 
              value={currentMonth} 
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>{month}</option>
              ))}
            </select>
            <select 
              value={currentYear} 
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            >
              {[2024, 2025, 2026, 2027, 2028].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="payroll-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="">All Departments</option>
            {getDepartments().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select value={filterStaffType} onChange={(e) => setFilterStaffType(e.target.value)}>
            <option value="">All Staff Types</option>
            {getStaffTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="payroll-analytics">
        <div className="analytics-header">
          <h2>Payroll Analytics</h2>
          <div className="analytics-controls">
            <select 
              value={analyticsMonth} 
              onChange={(e) => setAnalyticsMonth(parseInt(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>{month}</option>
              ))}
            </select>
            <select 
              value={analyticsYear} 
              onChange={(e) => setAnalyticsYear(parseInt(e.target.value))}
            >
              {[2024, 2025, 2026, 2027, 2028].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3>Net Payroll</h3>
              <p className="card-amount">{formatCurrency(analyticsData.netPayroll)}</p>
              {previousMonthData.netPayroll && (
                <div className={`card-change ${analyticsData.netPayroll >= previousMonthData.netPayroll ? 'positive' : 'negative'}`}>
                  {analyticsData.netPayroll >= previousMonthData.netPayroll ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {getPercentageChange(analyticsData.netPayroll, previousMonthData.netPayroll)}%
                </div>
              )}
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <h3>Staff Count</h3>
              <p className="card-amount">{analyticsData.staffCount}</p>
              {previousMonthData.staffCount && (
                <div className={`card-change ${analyticsData.staffCount >= previousMonthData.staffCount ? 'positive' : 'negative'}`}>
                  {analyticsData.staffCount >= previousMonthData.staffCount ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {getPercentageChange(analyticsData.staffCount, previousMonthData.staffCount)}%
                </div>
              )}
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon">
              <Plus size={24} />
            </div>
            <div className="card-content">
              <h3>Total Bonus</h3>
              <p className="card-amount">{formatCurrency(analyticsData.totalBonus)}</p>
              {previousMonthData.totalBonus !== undefined && (
                <div className={`card-change ${analyticsData.totalBonus >= previousMonthData.totalBonus ? 'positive' : 'negative'}`}>
                  {analyticsData.totalBonus >= previousMonthData.totalBonus ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {getPercentageChange(analyticsData.totalBonus, previousMonthData.totalBonus)}%
                </div>
              )}
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon">
              <Minus size={24} />
            </div>
            <div className="card-content">
              <h3>Total Deductions</h3>
              <p className="card-amount">{formatCurrency(analyticsData.totalDeductions)}</p>
              {previousMonthData.totalDeductions !== undefined && (
                <div className={`card-change ${analyticsData.totalDeductions <= previousMonthData.totalDeductions ? 'positive' : 'negative'}`}>
                  {analyticsData.totalDeductions <= previousMonthData.totalDeductions ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                  {getPercentageChange(analyticsData.totalDeductions, previousMonthData.totalDeductions)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="payroll-table-container">
        <div className="payroll-table-header">
          <h3>Staff Payroll - {monthNames[currentMonth - 1]} {currentYear}</h3>
          <div className="table-summary">
            <span className="summary-item">
              Total Staff: <strong>{getFilteredStaff().length}</strong>
            </span>
            <span className="summary-item">
              Total Amount: <strong>{formatCurrency(getFilteredStaff().reduce((sum, staff) => sum + staff.netSalary, 0))}</strong>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="payroll-loading">
            <div className="loading-spinner"></div>
            <p>Loading payroll data...</p>
          </div>
        ) : (
          <div className="payroll-table-wrapper">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Staff Details</th>
                  <th>Basic Salary</th>
                  <th>Working Days</th>
                  <th>Actual Days</th>
                  <th>Bonus</th>
                  <th>Miscellaneous</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredStaff().map((staff) => (
                  <tr key={staff.staffId}>
                    <td>
                      <div className="staff-info">
                        <div className="staff-name">{staff.staffName}</div>
                        <div className="staff-details">
                          <span className="staff-id">ID: {staff.staffId}</span>
                          <span className="staff-department">{staff.department}</span>
                          <span className="staff-type">{staff.staffType}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={staff.basicSalary}
                        onChange={(e) => handleInputChange(staff.staffId, 'basicSalary', e.target.value)}
                        className="salary-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={staff.workingDays}
                        onChange={(e) => handleInputChange(staff.staffId, 'workingDays', e.target.value)}
                        className="days-input"
                        min="1"
                        max="31"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={staff.actualDays}
                        onChange={(e) => handleInputChange(staff.staffId, 'actualDays', e.target.value)}
                        className="days-input"
                        min="0"
                        max="31"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={staff.bonus}
                        onChange={(e) => handleInputChange(staff.staffId, 'bonus', e.target.value)}
                        className="amount-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={staff.miscellaneous}
                        onChange={(e) => handleInputChange(staff.staffId, 'miscellaneous', e.target.value)}
                        className="amount-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={staff.deductions}
                        onChange={(e) => handleInputChange(staff.staffId, 'deductions', e.target.value)}
                        className="amount-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <div className="net-salary">
                        {formatCurrency(staff.netSalary)}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${staff.status}`}>
                        {staff.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payroll