"use client"
// context/AdminDataContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminDataContext = createContext(null);

export const useAdminData = () => useContext(AdminDataContext);

export function AdminDataProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const fetchAll = async () => {
      try {
        const [doctorRes, patientRes, appointmentRes] = await Promise.all([
          axios.get("http://localhost:4000/api/doctor", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/api/appointments"),
        ]);

        setDoctors(doctorRes.data.doctors || []);
        setPatients(patientRes.data.patients || []);
        setAppointments(appointmentRes.data.appointments || []);
      } catch (err) {
        console.log("🔴 Failed to fetch admin data", err);
      }
    };

    fetchAll();
  }, []);

  return (
    <AdminDataContext.Provider value={{ doctors, patients, appointments }}>
      {children}
    </AdminDataContext.Provider>
  );
}
