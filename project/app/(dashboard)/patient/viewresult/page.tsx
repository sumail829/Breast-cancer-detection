"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ViewResult() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchMedicalReport = async () => {
      try {
        const currentPatientId = localStorage.getItem("patientId"); // or from context/auth
        if (!currentPatientId) {
          console.warn("❌ No patient ID found in localStorage.");
          return;
        }

        const res = await axios.get(`http://localhost:4000/api/records/patient/${currentPatientId}`);

        const allReports = res.data.records;
        console.log(allReports);
          const latestReport = allReports[0];// or allReports[0]
         setReport(latestReport);
      } catch (error) {
        console.error("Something went wrong", error);
      }
    };

    fetchMedicalReport();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🧾 Medical Report</h2>
      {report ? (
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4 border border-gray-200">
          {/* <p>
            <span className="font-semibold">Patient Name:</span>{" "}
            {report.patientId?.firstName || "Unknown"} {report.patientId?.lastName || ""}
          </p> */}
          <p>
            <span className="font-semibold">Doctor Name:</span>{" "}
            {report.doctorId?.firstName || "Unknown"} {report.doctorId?.lastName || ""}
          </p>
          <p><span className="font-semibold">Diagnosis:</span> {report.diagnosis || "N/A"}</p>
          <p><span className="font-semibold">Prescription:</span> {report.prescription || "N/A"}</p>
          <p><span className="font-semibold">Note:</span> {report.notes || "N/A"}</p>
          <p><span className="font-semibold">Diagnosis Result:</span> {report.diagnosisResult || "Pending"}</p>
          <p>
            <span className="font-semibold">Confidence:</span>{" "}
            {typeof report.predictionConfidence === "number"
              ? report.predictionConfidence.toFixed(2) + "%"
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Prediction Date:</span>{" "}
            {report.predictionDate
              ? new Date(report.predictionDate).toLocaleString()
              : "N/A"}
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading medical report...</p>
      )}
    </div>
  );
}
