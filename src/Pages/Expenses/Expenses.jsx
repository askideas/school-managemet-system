import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Wallet, CreditCard, Calendar, Plus } from "lucide-react";
import "./Expenses.css";

const Expenses = () => {
    const [filterMonth, setFilterMonth] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [expensesData, setExpensesData] = useState([
        { id: "E001", name: "Stationary", category: "School Supplies", amount: 5000, paid: 5000, date: "2025-10-01" },
        { id: "E002", name: "Electricity Bill", category: "Utilities", amount: 12000, paid: 8000, date: "2025-10-05" },
        { id: "E003", name: "Internet", category: "Utilities", amount: 5000, paid: 5000, date: "2025-10-07" },
        { id: "E004", name: "Sports Equipment", category: "Activities", amount: 8000, paid: 3000, date: "2025-10-10" },
    ]);

    const [newExpense, setNewExpense] = useState({
        name: "",
        category: "",
        amount: "",
        paid: "",
        date: "",
    });

    const filteredExpenses = filterMonth
        ? expensesData.filter((e) => e.date.startsWith(filterMonth))
        : expensesData;

    // Top stats
    const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
    const totalPaid = filteredExpenses.reduce((acc, e) => acc + e.paid, 0);
    const totalPending = totalExpenses - totalPaid;
    const avgMonthly = (totalExpenses / filteredExpenses.length || 0).toFixed(2);

    const chartData = [
        { month: "Jan", amount: 15000 },
        { month: "Feb", amount: 10000 },
        { month: "Mar", amount: 12000 },
        { month: "Apr", amount: 18000 },
        { month: "May", amount: 14000 },
    ];

    const handleSaveExpense = () => {
        const newId = `E${(expensesData.length + 1).toString().padStart(3, "0")}`;
        setExpensesData([
            ...expensesData,
            { id: newId, ...newExpense, amount: Number(newExpense.amount), paid: Number(newExpense.paid) },
        ]);
        setNewExpense({ name: "", category: "", amount: "", paid: "", date: "" });
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        setExpensesData(expensesData.filter((e) => e.id !== id));
    };

    return (
        <div className="expenses-container">
            {/* Top Stat Cards */}
            <div className="expenses-row">
                <div className="expenses-col">
                    <div className="expenses-card">
                        <div className="expenses-icon-circle bg-purple">
                            <Wallet />
                        </div>
                        <div className="expenses-card-text">
                            <p className="expenses-text-muted">Total Expenses</p>
                            <h3 className="expenses-card-number">₹ {totalExpenses.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="expenses-col">
                    <div className="expenses-card">
                        <div className="expenses-icon-circle bg-green">
                            <CreditCard />
                        </div>
                        <div className="expenses-card-text">
                            <p className="expenses-text-muted">Paid</p>
                            <h3 className="expenses-card-number">₹ {totalPaid.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="expenses-col">
                    <div className="expenses-card">
                        <div className="expenses-icon-circle bg-red">
                            <CreditCard />
                        </div>
                        <div className="expenses-card-text">
                            <p className="expenses-text-muted">Pending</p>
                            <h3 className="expenses-card-number">₹ {totalPending.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="expenses-col">
                    <div className="expenses-card">
                        <div className="expenses-icon-circle bg-blue">
                            <Calendar />
                        </div>
                        <div className="expenses-card-text">
                            <p className="expenses-text-muted">Monthly Avg</p>
                            <h3 className="expenses-card-number">₹ {avgMonthly}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Add Button */}
            <div className="expenses-row expenses-align-center">
                <div className="expenses-col-lg-4">
                    <input
                        type="month"
                        className="expenses-input"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    />
                </div>
                <div className="expenses-col-lg-auto">
                    <button
                        className="expenses-add-btn"
                        onClick={() => setModalOpen(true)}
                    >
                        <Plus /> Add Expense
                    </button>
                </div>
            </div>


            {/* Expenses Table */}
            <div className="expenses-row">
                <div className="expenses-col-lg-12">
                    <div className="expenses-table-card">
                        <h5 className="expenses-table-title">Expenses List</h5>
                        <table className="expenses-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Paid</th>
                                    <th>Pending</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((e) => {
                                    const pending = e.amount - e.paid;
                                    return (
                                        <tr key={e.id}>
                                            <td>{e.id}</td>
                                            <td>{e.name}</td>
                                            <td>{e.category}</td>
                                            <td>₹ {e.amount.toLocaleString()}</td>
                                            <td>₹ {e.paid.toLocaleString()}</td>
                                            <td>₹ {pending.toLocaleString()}</td>
                                            <td>{e.date}</td>
                                            <td>
                                                <button className="expenses-btn-edit">Edit</button>{" "}
                                                <button className="expenses-btn-delete" onClick={() => handleDelete(e.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Expenses Chart */}
            <div className="expenses-row">
                <div className="expenses-col-lg-12">
                    <div className="expenses-chart-card">
                        <h5 className="expenses-chart-title">Monthly Expenses</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#4D44B5" barSize={40} radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="expenses-modal-overlay">
                    <div className="expenses-modal">
                        <h5>Add Expense</h5>
                        <input
                            type="text"
                            placeholder="Expense Name"
                            value={newExpense.name}
                            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                            className="expenses-modal-input"
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            className="expenses-modal-input"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            className="expenses-modal-input"
                        />
                        <input
                            type="number"
                            placeholder="Paid Amount"
                            value={newExpense.paid}
                            onChange={(e) => setNewExpense({ ...newExpense, paid: e.target.value })}
                            className="expenses-modal-input"
                        />
                        <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            className="expenses-modal-input"
                        />
                        <div className="expenses-modal-actions">
                            <button className="expenses-btn" onClick={handleSaveExpense}>Save</button>
                            <button className="expenses-btn-delete" onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
