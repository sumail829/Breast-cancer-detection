'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, Users, Stethoscope } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface Doctor {
  doctorId: number;
  firstName: string;
  lastName: string;
  specialization: string;
  department: string;
  phone: string;
}

export default function AllDoctorsPage() {
  const [doctor, setDoctor] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor`);
        const data = await res.json();
        setDoctor(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctor.filter((doctor) => {
      const fullName = `${doctor.firstName} ${doctor.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.doctorId.toString().includes(searchTerm)
      );
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, doctor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
          
           
          </div>
        </div>

      
        {/* Search Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, specialization, department, or ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Doctor ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Specialization</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.doctorId} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                        {doctor.doctorId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {doctor.firstName[0]}
                          {doctor.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {doctor.firstName} {doctor.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 font-medium">{doctor.phone}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 font-medium">{doctor.specialization}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{doctor.department}</span>
                    </td>
                    <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button>View details</Button>
    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No doctor found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Results Counter */}
        {filteredDoctors.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredDoctors.length}</span> of{' '}
              <span className="font-semibold">{doctor.length}</span> doctor
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
