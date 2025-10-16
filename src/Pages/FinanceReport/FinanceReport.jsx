import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { DollarSign, CreditCard, Wallet, Users } from "lucide-react";
import "./FinanceReport.css";

const FinanceReport = () => {
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Sample Data
  const earningsData = [
    { month: "Jan", total: 50000, fees: 20000 },
    { month: "Feb", total: 70000, fees: 30000 },
    { month: "Mar", total: 80000, fees: 35000 },
    { month: "Apr", total: 60000, fees: 25000 },
    { month: "May", total: 90000, fees: 40000 },
  ];

  const expensesData = [
    { name: "Salaries", amount: 50000 },
    { name: "Maintenance", amount: 15000 },
    { name: "Stationery", amount: 8000 },
    { name: "Transport", amount: 12000 },
  ];

  const pendingFeesData = [
    { name: "Class 1", value: 5000 },
    { name: "Class 2", value: 3000 },
    { name: "Class 3", value: 2000 },
    { name: "Class 4", value: 4000 },
  ];

  const COLORS = ["#4D44B5", "#FFB74D", "#FF5252", "#27AE60"];

  // Calculations
  const totalRevenue = earningsData.reduce((acc, e) => acc + e.total, 0);
  const totalFees = earningsData.reduce((acc, e) => acc + e.fees, 0);
  const totalExpenses = expensesData.reduce((acc, e) => acc + e.amount, 0);
  const totalPending = pendingFeesData.reduce((acc, e) => acc + e.value, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="finance-container">

      {/* Top Stats Cards */}
      <div className="finance-row">
        <div className="finance-col-lg-3">
          <div className="finance-card bg-purple">
            <div className="finance-card-icon"><DollarSign /></div>
            <p className="finance-text-muted">Revenue</p>
            <h3>₹ {totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="finance-col-lg-3">
          <div className="finance-card bg-red">
            <div className="finance-card-icon"><Wallet /></div>
            <p className="finance-text-muted">Expenses</p>
            <h3>₹ {totalExpenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="finance-col-lg-3">
          <div className="finance-card bg-green">
            <div className="finance-card-icon"><CreditCard /></div>
            <p className="finance-text-muted">Profit</p>
            <h3>₹ {totalProfit.toLocaleString()}</h3>
          </div>
        </div>
        <div className="finance-col-lg-3">
          <div className="finance-card bg-blue">
            <div className="finance-card-icon"><Users /></div>
            <p className="finance-text-muted">Pending Fees</p>
            <h3>₹ {totalPending.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="finance-row finance-filters">
        <input type="month" className="finance-input" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} placeholder="Select Month"/>
        <input type="number" className="finance-input" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} placeholder="Enter Year"/>
      </div>

      {/* Charts Row */}
      <div className="finance-row">
        <div className="finance-col-lg-6">
          <div className="finance-chart-card">
            <h5 className="finance-chart-title">Earnings Over Months</h5>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="totalRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D44B5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4D44B5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="totalFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="total" stroke="#4D44B5" fill="url(#totalRevenue)" fillOpacity={1}/>
                <Area type="monotone" dataKey="fees" stroke="#FF5252" fill="url(#totalFees)" fillOpacity={1}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="finance-col-lg-6">
          <div className="finance-chart-card">
            <h5 className="finance-chart-title">Expenses Breakdown</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="amount" fill="#FF5252" barSize={40} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Fees Pie */}
      <div className="finance-row">
        <div className="finance-col-lg-6">
          <div className="finance-chart-card">
            <h5 className="finance-chart-title">Pending Fees by Class</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pendingFeesData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                  {pendingFeesData.map((entry,index)=>(
                    <Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="finance-col-lg-6">
          <div className="finance-table-card">
            <h5 className="finance-table-title">Expenses Details</h5>
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expensesData.map((item,index)=>(
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>₹ {item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FinanceReport;
