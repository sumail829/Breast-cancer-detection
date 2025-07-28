"use client"
import { useAdminData } from '@/app/context/AdminDataContext';
import React from 'react';

type Patient = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  createdAt: string;
};

export default function ShowPatients() {
  const { patients } = useAdminData();

  return(
     <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patient List</h2>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium text-gray-900">Name</th>
              <th className="p-3 text-left font-medium text-gray-900">Email</th>
              <th className="p-3 text-left font-medium text-gray-900">Phone</th>
              <th className="p-3 text-left font-medium text-gray-900">Gender</th>
              <th className="p-3 text-left font-medium text-gray-900">Age</th>
              <th className="p-3 text-left font-medium text-gray-900">Date of Birth</th>
              <th className="p-3 text-left font-medium text-gray-900">Blood Group</th>
              <th className="p-3 text-left font-medium text-gray-900">Address</th>
              <th className="p-3 text-left font-medium text-gray-900">Emergency Contact</th>
              <th className="p-3 text-left font-medium text-gray-900">Created At</th>
            </tr>
          </thead>
          <tbody>
            {patients?.map((patient: Patient) => (
              <tr key={patient._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{patient.firstName} {patient.lastName}</td>
                <td className="p-3">{patient.email}</td>
                <td className="p-3">{patient.phone}</td>
                <td className="p-3">{patient.gender}</td>
                <td className="p-3">{patient.age}</td>
                <td className="p-3">{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                <td className="p-3">{patient.bloodGroup}</td>
                <td className="p-3">{patient.address}</td>
                <td className="p-3">{patient.emergencyContact}</td>
                <td className="p-3">{new Date(patient.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
