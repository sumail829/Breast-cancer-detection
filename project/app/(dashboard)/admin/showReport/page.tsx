"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ShowReport() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/records");
        setReports(res.data.records || []);
        console.log(res.data, "Medical reports fetched");
      } catch (error) {
        console.error("Something went wrong", error);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Medical Reports</h1>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reports available.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2 border">Patient Name</th>
                <th className="px-4 py-2 border">Age</th>
                <th className="px-4 py-2 border">Gender</th>
                <th className="px-4 py-2 border">Doctor</th>
                <th className="px-4 py-2 border">Diagnosis</th>
                <th className="px-4 py-2 border">Result</th>
                <th className="px-4 py-2 border">Notes</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {record.patientId?.firstName} {record.patientId?.lastName}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.patientId?.age}
                  </td>
                  <td className="px-4 py-2 border capitalize">
                    {record.patientId?.gender}
                  </td>
                  <td className="px-4 py-2 border">
                    Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.diagnosis}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.diagnosisResult}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.notes}
                  </td>
                  <td className="px-4 py-2 border">
                    {record.date?.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
