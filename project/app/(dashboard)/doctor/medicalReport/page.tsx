"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function MedicalRecordForm() {
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    diagnosisResult: "Pending",
    predictionConfidence: "",
    predictionDate: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      try {

        const user = JSON.parse(localStorage.getItem('userData') || '{}');
        const doctorId = user._id;
        const doctorsRes = await axios.get(`http://localhost:4000/api/appointments/doctor/${doctorId}`)
        console.log(doctorsRes.data, "this is appointment of doctors")

        setDoctors(doctorsRes.data.DoctorAppo);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post("http://localhost:4000/api/records/create", form);
      setMessage("Medical record created successfully!");
      setForm({
        patientId: "",
        doctorId: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        diagnosisResult: "Pending",
        predictionConfidence: "",
        predictionDate: "",
      });
    } catch (err) {
      setMessage("Error creating medical record.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex flex-row justify-center items-center max-w-4/6 mx-auto'>
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Create Medical Record</h2>
        {message && (
          <div className={`mb-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Patient</label>
            <select name="patientId" value={form.patientId} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
              <option value="">Select Patient</option>
              {Array.from(new Map(doctors.map(app => [app.patientId._id, app.patientId])).values()).map((p) => (
                <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Doctor</label>
            <select name="doctorId" value={form.doctorId} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
              <option value="">Select Doctor</option>
              {Array.from(new Map(doctors.map(app => [app.doctorId._id, app.doctorId])).values()).map((d) => (
                <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium mb-1">Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Prescription */}
          <div>
            <label className="block text-sm font-medium mb-1">Prescription</label>
            <input
              type="text"
              name="prescription"
              value={form.prescription}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Diagnosis Result */}
          <div>
            <label className="block text-sm font-medium mb-1">Diagnosis Result</label>
            <select name="diagnosisResult" value={form.diagnosisResult} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="Pending">Pending</option>
              <option value="Benign">Benign</option>
              <option value="Malignant">Malignant</option>
            </select>
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium mb-1">Prediction Confidence (%)</label>
            <input
              type="number"
              name="predictionConfidence"
              value={form.predictionConfidence}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Prediction Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Prediction Date</label>
            <input
              type="date"
              name="predictionDate"
              value={form.predictionDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {loading ? "Submitting..." : "Create Record"}
          </button>
        </form>
      </div>
    </div>
  )
}
