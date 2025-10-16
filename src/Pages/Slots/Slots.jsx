import React, { useState } from "react";
import { Edit, Trash2, Save } from "lucide-react";
import "./Slots.css";

const Slots = () => {
  const [slots, setSlots] = useState([
    { id: "S001", name: "Morning Slot", from: "08:00", to: "09:00" },
    { id: "S002", name: "Midday Slot", from: "12:00", to: "13:00" },
  ]);

  const [formData, setFormData] = useState({ id: "", name: "", from: "", to: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.from || !formData.to)
      return alert("Please fill all fields!");

    if (formData.id) {
      // Edit existing
      setSlots((prev) =>
        prev.map((slot) => (slot.id === formData.id ? { ...formData } : slot))
      );
    } else {
      // Add new
      const newId = `S${(slots.length + 1).toString().padStart(3, "0")}`;
      setSlots((prev) => [...prev, { ...formData, id: newId }]);
    }

    setFormData({ id: "", name: "", from: "", to: "" });
  };

  const handleEdit = (slot) => {
    setFormData(slot);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      setSlots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="slots-container">
      <div className="slots-row">

        {/* Form */}
        <div className="slots-col-lg-4">
          <div className="slots-form-card">
            <h5 className="slots-form-title">{formData.id ? "Edit Slot" : "Add Slot"}</h5>

            <label>Slot ID</label>
            <input
              type="text"
              className="slots-input"
              name="id"
              value={formData.id}
              disabled
              placeholder="Auto-generated"
            />

            <label>Slot Name</label>
            <input
              type="text"
              className="slots-input"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Slot Name"
            />

            <label>From Time</label>
            <input
              type="time"
              className="slots-input"
              name="from"
              value={formData.from}
              onChange={handleInputChange}
            />

            <label>To Time</label>
            <input
              type="time"
              className="slots-input"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
            />

            <button className="slots-save-btn" onClick={handleSave}>
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* Slots List */}
        <div className="slots-col-lg-8">
          <div className="slots-table-card">
            <h5 className="slots-table-title">Slots List</h5>
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Slot ID</th>
                  <th>Slot Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.id}</td>
                    <td>{slot.name}</td>
                    <td>{slot.from}</td>
                    <td>{slot.to}</td>
                    <td>
                      <button
                        className="slots-edit-btn"
                        onClick={() => handleEdit(slot)}
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        className="slots-delete-btn"
                        onClick={() => handleDelete(slot.id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
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

export default Slots;
