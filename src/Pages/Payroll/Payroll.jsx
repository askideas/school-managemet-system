import React, { useState } from "react";
import { User, Save } from "lucide-react";
import "./Payroll.css";

const Payroll = () => {
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", role: "Teacher", avatar: "", basicSalary: 40000, bonus: 5000, deductions: 2000 },
    { id: 2, name: "Jane Smith", role: "Admin", avatar: "", basicSalary: 35000, bonus: 3000, deductions: 1000 },
    { id: 3, name: "Robert Johnson", role: "Librarian", avatar: "", basicSalary: 30000, bonus: 2000, deductions: 500 },
  ]);

  const [savedPayrolls, setSavedPayrolls] = useState([
    { id: "P001", month: "2025-09", employees: employees },
  ]);

  const handleInputChange = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: Number(value) } : emp))
    );
  };

  const calculateNetSalary = (emp) => emp.basicSalary + emp.bonus - emp.deductions;

  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((acc, emp) => acc + calculateNetSalary(emp), 0);
  const totalBonus = employees.reduce((acc, emp) => acc + emp.bonus, 0);
  const totalDeductions = employees.reduce((acc, emp) => acc + emp.deductions, 0);

  const handleSavePayroll = () => {
    const payrollId = `P${(savedPayrolls.length + 1).toString().padStart(3, "0")}`;
    const date = new Date();
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    setSavedPayrolls([...savedPayrolls, { id: payrollId, month: monthYear, employees }]);
    alert("Payroll saved successfully!");
  };

  const filteredSavedPayrolls = savedPayrolls.filter((p) => {
    let match = true;
    if (monthFilter) match = p.month.startsWith(monthFilter);
    if (yearFilter) match = match && p.month.startsWith(yearFilter);
    return match;
  });

  return (
    <div className="payroll-container">

      {/* Employee Payroll Table */}
      <div className="payroll-row">
        <div className="payroll-col-lg-12">
          <div className="payroll-table-card">
            <h5 className="payroll-table-title">Employee Payroll</h5>
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Basic Salary</th>
                  <th>Bonus</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td className="payroll-employee-cell">
                      <div className="payroll-employee-avatar">
                        {emp.avatar ? <img src={emp.avatar} alt={emp.name} /> : <User />}
                      </div>
                      <span>{emp.name}</span>
                    </td>
                    <td>{emp.role}</td>
                    <td>
                      <input
                        type="number"
                        className="payroll-input"
                        value={emp.basicSalary}
                        onChange={(e) =>
                          handleInputChange(emp.id, "basicSalary", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="payroll-input"
                        value={emp.bonus}
                        onChange={(e) =>
                          handleInputChange(emp.id, "bonus", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="payroll-input"
                        value={emp.deductions}
                        onChange={(e) =>
                          handleInputChange(emp.id, "deductions", e.target.value)
                        }
                      />
                    </td>
                    <td>₹ {calculateNetSalary(emp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="payroll-row payroll-analytics-row">
        <div className="payroll-col">
          <div className="payroll-card bg-purple">
            <p className="payroll-text-muted">Total Employees</p>
            <h3 className="payroll-card-number">{totalEmployees}</h3>
          </div>
        </div>
        <div className="payroll-col">
          <div className="payroll-card bg-blue">
            <p className="payroll-text-muted">Total Payroll</p>
            <h3 className="payroll-card-number">₹ {totalPayroll.toLocaleString()}</h3>
          </div>
        </div>
        <div className="payroll-col">
          <div className="payroll-card bg-green">
            <p className="payroll-text-muted">Total Bonus</p>
            <h3 className="payroll-card-number">₹ {totalBonus.toLocaleString()}</h3>
          </div>
        </div>
        <div className="payroll-col">
          <div className="payroll-card bg-red">
            <p className="payroll-text-muted">Total Deductions</p>
            <h3 className="payroll-card-number">₹ {totalDeductions.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filters + Save Button */}
      <div className="payroll-row payroll-align-center">
        <div className="payroll-col-lg-3">
          <input
            type="month"
            className="payroll-input"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            placeholder="Filter by Month"
          />
        </div>
        <div className="payroll-col-lg-3">
          <input
            type="number"
            className="payroll-input"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            placeholder="Filter by Year"
          />
        </div>
        <div className="payroll-col-lg-auto">
          <button className="payroll-save-btn" onClick={handleSavePayroll}>
            <Save /> Save Payroll
          </button>
        </div>
      </div>

      {/* Saved Payroll Section */}
      <div className="payroll-row">
        <div className="payroll-col-lg-12">
          <div className="payroll-table-card">
            <h5 className="payroll-table-title">Saved Payrolls</h5>
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Month</th>
                  <th>Total Employees</th>
                  <th>Total Payroll</th>
                  <th>Total Bonus</th>
                  <th>Total Deductions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSavedPayrolls.map((pay) => {
                  const totalPayrollSaved = pay.employees.reduce(
                    (acc, emp) => acc + calculateNetSalary(emp),
                    0
                  );
                  const totalBonusSaved = pay.employees.reduce((acc, emp) => acc + emp.bonus, 0);
                  const totalDeductionSaved = pay.employees.reduce(
                    (acc, emp) => acc + emp.deductions,
                    0
                  );
                  return (
                    <tr key={pay.id}>
                      <td>{pay.id}</td>
                      <td>{pay.month}</td>
                      <td>{pay.employees.length}</td>
                      <td>₹ {totalPayrollSaved.toLocaleString()}</td>
                      <td>₹ {totalBonusSaved.toLocaleString()}</td>
                      <td>₹ {totalDeductionSaved.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Payroll;
