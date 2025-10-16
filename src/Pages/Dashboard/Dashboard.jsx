import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, User, DollarSign, Wallet, IndianRupee, Calendar, Bell } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const earningsData = [
    { name: "Jan", total: 40000, fees: 15000 },
    { name: "Feb", total: 60000, fees: 20000 },
    { name: "Mar", total: 80000, fees: 30000 },
    { name: "Apr", total: 50000, fees: 15000 },
    { name: "May", total: 70000, fees: 25000 },
  ];

  const expensesData = [
    { name: "Jan 2019", amount: 15000 },
    { name: "Feb 2019", amount: 10000 },
    { name: "Mar 2019", amount: 8000 },
  ];

  const studentsData = [
    { name: "Boys", value: 400 },
    { name: "Girls", value: 600 },
  ];

  const attendanceData = [
    { day: "Mon", present: 450, absent: 150 },
    { day: "Tue", present: 470, absent: 130 },
    { day: "Wed", present: 440, absent: 160 },
    { day: "Thu", present: 460, absent: 140 },
    { day: "Fri", present: 480, absent: 120 },
  ];

  const COLORS = ["#4D44B5", "#FFB74D"];

  const recentAdmissions = [
    { id: "S001", name: "Rahul Sharma", class: "8th" },
    { id: "S002", name: "Ananya Singh", class: "5th" },
    { id: "S003", name: "Vikram Patel", class: "10th" },
  ];

  const upcomingEvents = [
    { date: "18 Oct", event: "Parent Teacher Meeting" },
    { date: "22 Oct", event: "Annual Sports Day" },
    { date: "25 Oct", event: "Cultural Festival" },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="dashboard-card">
            <div className="icon-circle bg-green">
              <Users />
            </div>
            <div>
              <p className="text-muted">Students</p>
              <h3>150000</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <div className="icon-circle bg-blue">
              <User />
            </div>
            <div>
              <p className="text-muted">Teachers</p>
              <h3>2250</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <div className="icon-circle bg-yellow">
              <Users />
            </div>
            <div>
              <p className="text-muted">Parents</p>
              <h3>5690</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <div className="icon-circle bg-purple">
              <Calendar />
            </div>
            <div>
              <p className="text-muted">Classes</p>
              <h3>120</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="icon-circle bg-blue">
              <IndianRupee />
            </div>
            <div>
              <p className="text-muted">Expenses</p>
              <h3>₹ 5,000</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="icon-circle bg-orange">
              <Wallet />
            </div>
            <div>
              <p className="text-muted">Pending Fees</p>
              <h3>₹ 45,000</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="icon-circle bg-red">
              <IndianRupee />
            </div>
            <div>
              <p className="text-muted">Earnings</p>
              <h3>₹ 193000</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="chart-card">
            <h5 className="chart-title">Earnings</h5>
            <div className="chart-legends">
              <div><span className="legend-dot blue"></span>Total Collections</div>
              <div><span className="legend-dot red"></span>Fees Collection</div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D44B5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4D44B5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="feesColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF5252" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#4D44B5" fillOpacity={1} fill="url(#totalColor)" />
                <Area type="monotone" dataKey="fees" stroke="#FF5252" fillOpacity={1} fill="url(#feesColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="chart-card">
            <h5 className="chart-title">Expenses</h5>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4D44B5" barSize={40} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="chart-card">
            <h5 className="chart-title">Students Gender</h5>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={studentsData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                  {studentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Admissions & Upcoming Events */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="table-card">
            <h5 className="chart-title">Recent Admissions</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="table-card">
            <h5 className="chart-title">Upcoming Events</h5>
            <ul className="event-list">
              {upcomingEvents.map((event, index) => (
                <li key={index}>
                  <span className="event-date">{event.date}</span> - {event.event}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
