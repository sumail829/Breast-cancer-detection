'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ClipboardIcon, 
  FileTextIcon, 
  PlusIcon, 
  UserIcon,
  MessageCircleIcon,
  XIcon,
  TrendingUpIcon,
  ActivityIcon,
  ClockIcon,
  StethoscopeIcon
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { StatCard } from '@/components/dashboard/stat-card';
import DoctorAppointmentsList from '@/components/dashboard/doctor/appointments-list';
import DoctorPatientList from '@/components/dashboard/doctor/patient-list';
import axios from 'axios';
import { format } from "date-fns";
import ChatBox from '@/components/landing/chatbox';
import Link from 'next/link';
import MedicalRecordForm from '../medicalReport/page';

export default function DoctorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [doctor, setDoctor] = useState<null | {
    _id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    department: string;
    patients: string[];
  }>(null);

  const [appointmentData, setAppointmentData] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [record, setRecord] = useState([]);
  const [showMedicalForm, setShowMedicalForm] = useState(false);

  // Fetch doctor info on mount
  useEffect(() => {
    const storedDoctor = localStorage.getItem("userData");
    if (!storedDoctor) return;

    try {
      const doctorData = JSON.parse(storedDoctor);
      const doctorId = doctorData._id;

      const fetchDoctor = async () => {
        try {
          const res = await axios.get(`http://localhost:4000/api/doctor/${doctorId}`);
          setDoctor(res.data);
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        }
      };

      fetchDoctor();
    } catch (error) {
      console.error("Invalid JSON in doctorData:", error);
    }
  }, []);

  // Fetch doctor's appointments
  const fetchAppointmentById = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userData') || '{}');
      const doctorId = user._id;
      const res = await axios.get(`http://localhost:4000/api/appointments/doctor/${doctorId}`);
      setAppointmentData(res.data.DoctorAppo || []);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    if (user?.role === 'doctor') {
      fetchAppointmentById();
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const doctorId = user._id;
    const fetchDoctorReport = async () => { 
      try {
        const res = await axios.get(`http://localhost:4000/api/records/doctor/${doctorId}`)
        console.log(res.data, "this is data")
        setRecord(res.data.records || []);
      } catch (error) {
        console.log(error, "something went wrong")
      }
    }
    fetchDoctorReport();
  }, [])

  // Extract unique patients from appointments
  const getUniquePatients = (appointments: any[]) => {
    const unique = new Map();
    appointments.forEach((app) => {
      if (app.patientId && !unique.has(app.patientId._id)) {
        unique.set(app.patientId._id, app.patientId);
      }
    });
    return Array.from(unique.values());
  };

  const patientsList = getUniquePatients(appointmentData);

  // Today's date for filtering appointments
  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");

  const todaysAppointments = appointmentData.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const appointmentDateString = format(appointmentDate, "yyyy-MM-dd");
    return appointmentDateString === todayString;
  });

  // Toggle chat popup and reset selected patient when closing
  const toggleChat = () => {
    if (showChat) {
      setShowChat(false);
      setSelectedPatientId('');
    } else {
      setShowChat(true);
    }
  };

  const selectedPatient = patientsList.find(p => p._id === selectedPatientId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <StethoscopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Doctor Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  {doctor ? `Welcome back, Dr. ${doctor.firstName} ${doctor.lastName}!` : "Loading..."}
                </p>
                {doctor && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {doctor.specialization}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      {doctor.department}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowMedicalForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Record
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{patientsList.length}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1 text-green-500" />
                +4 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Appointments</CardTitle>
              <div className="p-2 bg-orange-100 rounded-full">
                <CalendarIcon className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{todaysAppointments.length}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <ClockIcon className="h-3 w-3 mr-1 text-blue-500" />
                Scheduled for today
              </p>
            </CardContent>
          </Card>

          <Link href="../doctor/patientReport" className="block">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-100 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Medical Records</CardTitle>
                <div className="p-2 bg-green-100 rounded-full">
                  <FileTextIcon className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{record.length}</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <ActivityIcon className="h-3 w-3 mr-1 text-green-500" />
                  Total records created
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Quick Actions</CardTitle>
              <div className="p-2 bg-white/20 rounded-full">
                <ClipboardIcon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ready</div>
              <p className="text-xs text-purple-100 mt-1">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Card className="bg-white shadow-xl border-0 ring-1 ring-gray-100">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="appointments"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger 
                value="patients"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
              >
                Patients
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity</CardTitle>
                      <CardDescription>Your latest patient interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {todaysAppointments.slice(0, 3).map((appointment, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <UserIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(appointment.date), "MMM dd, yyyy")} at {appointment.time}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {appointment.status || 'Scheduled'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Stats</CardTitle>
                      <CardDescription>Your performance overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Appointments This Week</span>
                          <span className="font-semibold text-lg">{appointmentData.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Records Created</span>
                          <span className="font-semibold text-lg">{record.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Patients</span>
                          <span className="font-semibold text-lg">{patientsList.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="mt-0">
                <DoctorAppointmentsList
                  doctorsData={appointmentData}
                  onRefresh={fetchAppointmentById}
                />
              </TabsContent>

              <TabsContent value="patients" className="mt-0">
                <DoctorPatientList patientData={appointmentData} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Medical Record Form Modal */}
        {showMedicalForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Create Medical Record</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMedicalForm(false)}
                  className="hover:bg-gray-100"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                <MedicalRecordForm onClose={() => setShowMedicalForm(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Floating Chat */}
        <div className="fixed bottom-6 right-6 z-40">
          {showChat && (
            <Card className="w-96 h-[32rem] shadow-2xl border-0 ring-1 ring-gray-200 mb-4 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircleIcon className="h-5 w-5" />
                    <CardTitle className="text-lg">Patient Chat</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="hover:bg-white/20 text-white"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                {!selectedPatientId ? (
                  <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Select a Patient</h3>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                      <option value="">Choose a patient to chat with...</option>
                      {patientsList.length > 0 ? (
                        patientsList.map((patient) => (
                          <option key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No patients found</option>
                      )}
                    </select>
                    <Button
                      disabled={!selectedPatientId}
                      onClick={() => setShowChat(true)}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      Start Conversation
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 bg-gray-50 border-b">
                      <p className="font-medium text-gray-900">
                        Chatting with {selectedPatient?.firstName} {selectedPatient?.lastName}
                      </p>
                    </div>
                    <div className="flex-1">
                      <ChatBox
                        doctorId={doctor?._id || ''}
                        patientId={selectedPatientId}
                        doctorName={`Dr. ${doctor?.firstName} ${doctor?.lastName}`}
                        patientName={`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
                        userRole="doctor"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Button
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            size="icon"
          >
            <MessageCircleIcon className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}