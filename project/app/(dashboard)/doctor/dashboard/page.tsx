'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClipboardIcon, FileTextIcon, PlusIcon, UserIcon } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { StatCard } from '@/components/dashboard/stat-card';
import DoctorAppointmentsList from '@/components/dashboard/doctor/appointments-list';
import DoctorPatientList from '@/components/dashboard/doctor/patient-list';
import DoctorPredictionsChart from '@/components/dashboard/doctor/predictions-chart';
import axios from 'axios';
import { format } from "date-fns";
import ChatBox from '@/components/landing/chatbox';

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
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          {doctor ? `Welcome back, Dr. ${doctor.firstName} ${doctor.lastName}!` : "Loading..."}
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Patients"
              value={patientsList.length}
              description="under your care"
              icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 4, isPositive: true }}
            />
            <DashboardCard
              title="Today's Appointments"
              value={todaysAppointments.length.toString()}
              description="scheduled for today"
              icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 0, isPositive: true }}
            />
            <DashboardCard
              title="Cancer Detection Tests"
              value="9" // You can update this dynamically if you have data
              description="this week"
              icon={<ClipboardIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 2, isPositive: true }}
            />
            <DashboardCard
              title="Medical Records"
              value="438" // You can update this dynamically if you have data
              description="total records"
              icon={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 12, isPositive: true }}
            />
          </div>

          {/* ...other overview content like charts, lists... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>Breast cancer detection tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Barbara Anderson</p>
                      <div className="flex items-center">
                        <p className="text-xs text-green-600 font-medium">Benign</p>
                        <p className="text-xs text-muted-foreground ml-2">95% confidence</p>
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">Today</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-red-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jennifer Lopez</p>
                      <div className="flex items-center">
                        <p className="text-xs text-red-600 font-medium">Malignant</p>
                        <p className="text-xs text-muted-foreground ml-2">92% confidence</p>
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">Yesterday</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Maria Garcia</p>
                      <div className="flex items-center">
                        <p className="text-xs text-yellow-600 font-medium">Pending</p>
                        <p className="text-xs text-muted-foreground ml-2">Awaiting results</p>
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">Yesterday</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>Performance metrics this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="Patients Seen"
                    value="267"
                    trend={{
                      value: 12,
                      label: "vs last month",
                      positive: true
                    }}
                  />
                  <StatCard
                    title="Average Rating"
                    value="4.8/5"
                    trend={{
                      value: 0.2,
                      label: "vs last month",
                      positive: true
                    }}
                  />
                  <StatCard
                    title="Detection Accuracy"
                    value="97.2%"
                    trend={{
                      value: 1.5,
                      label: "vs last month",
                      positive: true
                    }}
                  />
                  <StatCard
                    title="Response Time"
                    value="2h 15m"
                    trend={{
                      value: 15,
                      label: "vs last month",
                      positive: false
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <DoctorAppointmentsList
            doctorsData={appointmentData}
            onRefresh={fetchAppointmentById}
          />
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <DoctorPatientList patientData={appointmentData} />
        </TabsContent>
      </Tabs>

      {/* Floating Chat UI */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Chat box popup */}
        {showChat && (
          <div
            style={{
              width: 370,
              height: 480,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: 8,
              backgroundColor: 'white',
              overflow: 'hidden',
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              padding: 12,
            }}
          >
            {!selectedPatientId ? (
              <>
                <h3 className="font-semibold mb-2">Select a Patient to Chat</h3>
                <select
                  className="w-full border rounded p-2 mb-4"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">-- Choose Patient --</option>
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
                  onClick={() => {  setShowChat(true);/* no-op or optionally open chat */ }}
                >
                  Start Chat
                </Button>
              </>
            ) : (
              <>
                <div
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #eee',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* <span>Chat with Patient</span> */}
                  <button
                    onClick={toggleChat}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 18,
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                    aria-label="Close chat"
                  >
                    ×
                  </button>
                </div>
                <ChatBox
                  doctorId={doctor?._id || ''}
                  patientId={selectedPatientId}
                  doctorName={`Dr. ${doctor?.firstName} ${doctor?.lastName}`}
                  patientName={`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
                  userRole="doctor"
                  style={{ flex: 1 }}
                />
              </>
            )}
          </div>
        )}

        {/* Floating Chat Button */}
        <Button
          variant="default"
          size="icon"
          onClick={toggleChat}
          aria-label={showChat ? "Close chat" : "Open chat"}
           style={{
              position: 'fixed',
              bottom: 20,
              left: showChat ? 360 : 20,
              borderRadius: '50%',
              width: 56,
              height: 56,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 999,
            }}
        >
          {/* Chat icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>



    </div>
  );
}
