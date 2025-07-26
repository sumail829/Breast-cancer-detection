"use client";
import React, { useEffect } from "react";
import { useAdminData } from "@/app/context/AdminDataContext";

export default function ShowDoctor() {
  const { doctors } = useAdminData();

   useEffect(() => {
    console.log(doctors, "✅ this is doctors");
  }, [doctors]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Doctor List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Specialization</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {doctors?.length > 0 ? (
              doctors.map((doc) => (
                <tr key={doc._id} className="border-t">
                  <td className="px-4 py-2">
                    {doc.firstName} {doc.lastName}
                  </td>
                  <td className="px-4 py-2">{doc.email}</td>
                  <td className="px-4 py-2">{doc.phone}</td>
                  <td className="px-4 py-2">{doc.department}</td>
                  <td className="px-4 py-2">{doc.specialization}</td>
                  <td className="px-4 py-2">
                    {new Date(doc.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 text-center" colSpan={6}>
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
