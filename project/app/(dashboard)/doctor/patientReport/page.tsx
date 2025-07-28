'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

interface MedicalRecord {
  _id: string;
  diagnosis: string;
  diagnosisResult: string;
  prescription: string;
  notes: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  patientId: Patient;
}

export default function DoctorMedicalRecordsTable() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const doctorId = user._id;

    const fetchDoctorReport = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/records/doctor/${doctorId}`);
    setRecords(res.data.records || []);
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    };

    fetchDoctorReport();
  }, []);

  return (
    <div className="overflow-x-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Medical Records</h2>
      <table className="min-w-full divide-y divide-gray-200 border rounded-md">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Patient Name</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Diagnosis</th>
            <th className="px-4 py-2 text-left">Result</th>
            <th className="px-4 py-2 text-left">Prescription</th>
            <th className="px-4 py-2 text-left">Notes</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                {record.patientId?.firstName} {record.patientId?.lastName}
              </td>
              <td className="px-4 py-2">{record.patientId?.age}</td>
              <td className="px-4 py-2">{record.patientId?.email}</td>
              <td className="px-4 py-2">{record.diagnosis}</td>
              <td className="px-4 py-2">{record.diagnosisResult}</td>
              <td className="px-4 py-2">{record.prescription}</td>
              <td className="px-4 py-2">{record.notes}</td>
              <td className="px-4 py-2">
                {new Date(record.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No records found.</p>
      )}
    </div>
  );
}
