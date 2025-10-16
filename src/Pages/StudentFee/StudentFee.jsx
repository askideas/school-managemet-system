import React, { useState } from "react";
import { User, DollarSign, IndianRupee, CreditCard } from "lucide-react";
import "./StudentFee.css";

const StudentFee = () => {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");

  // Dummy data
  const studentsData = [
    { id: "S001", name: "Rahul Sharma", class: "8th", total: 50000, paid: 30000 },
    { id: "S002", name: "Ananya Singh", class: "5th", total: 40000, paid: 40000 },
    { id: "S003", name: "Vikram Patel", class: "10th", total: 60000, paid: 20000 },
    { id: "S004", name: "Sara Khan", class: "8th", total: 50000, paid: 50000 },
  ];

  const classes = ["5th", "8th", "10th"];

  const filteredStudents = studentsData.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterClass === "" || s.class === filterClass)
    );
  });

  // Top summary cards
  const totalStudents = studentsData.length;
  const totalFees = studentsData.reduce((acc, s) => acc + s.total, 0);
  const totalPaid = studentsData.reduce((acc, s) => acc + s.paid, 0);
  const totalPending = totalFees - totalPaid;

  // Class-wise summary
  const classSummary = classes.map((cls) => {
    const clsStudents = studentsData.filter((s) => s.class === cls);
    const clsTotal = clsStudents.reduce((acc, s) => acc + s.total, 0);
    const clsPaid = clsStudents.reduce((acc, s) => acc + s.paid, 0);
    const clsPending = clsTotal - clsPaid;
    return { class: cls, total: clsTotal, paid: clsPaid, pending: clsPending };
  });

  return (
    <div className="dashboard-container">
      {/* Top Stat Cards */}
      <div className="dashboard-row">
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="dashboard-icon-circle bg-green">
              <User />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-text-muted">Total Students</p>
              <h3 className="dashboard-card-number">{totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="dashboard-icon-circle bg-blue">
              <IndianRupee />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-text-muted">Total Fees</p>
              <h3 className="dashboard-card-number">₹ {totalFees.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="dashboard-icon-circle bg-yellow">
              <DollarSign />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-text-muted">Paid Amount</p>
              <h3 className="dashboard-card-number">₹ {totalPaid.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="dashboard-icon-circle bg-red">
              <CreditCard />
            </div>
            <div className="dashboard-card-text">
              <p className="dashboard-text-muted">Pending Amount</p>
              <h3 className="dashboard-card-number">₹ {totalPending.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-row">
        <div className="dashboard-col-lg-6">
          <input
            type="text"
            className="dashboard-input"
            placeholder="Search Student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="dashboard-col-lg-3">
          <select
            className="dashboard-input"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Fee Table */}
      <div className="dashboard-row">
        <div className="dashboard-col-lg-12">
          <div className="dashboard-table-card">
            <h5 className="dashboard-chart-title">Student Fees</h5>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Total Fee</th>
                  <th>Paid Amount</th>
                  <th>Pending Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const pending = s.total - s.paid;
                  const status =
                    pending === 0 ? "Paid" : s.paid === 0 ? "Pending" : "Partial";
                  return (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td>₹ {s.total.toLocaleString()}</td>
                      <td>₹ {s.paid.toLocaleString()}</td>
                      <td>₹ {pending.toLocaleString()}</td>
                      <td>
                        <span
                          className={`dashboard-fee-status ${
                            status === "Paid"
                              ? "paid"
                              : status === "Pending"
                              ? "pending"
                              : "partial"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <button className="dashboard-btn">Pay / View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class-wise Summary */}
      <div className="dashboard-row">
        {classSummary.map((cls) => (
          <div className="dashboard-col-lg-3" key={cls.class}>
            <div className="dashboard-card">
              <div className="dashboard-card-text">
                <p className="dashboard-text-muted">{cls.class} Class</p>
                <p>Total: ₹ {cls.total.toLocaleString()}</p>
                <p>Paid: ₹ {cls.paid.toLocaleString()}</p>
                <p>Pending: ₹ {cls.pending.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFee;
