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


export default function DoctorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [doctor, setDoctor] = useState<null | {
    firstName: string;
    lastName: string;
    specialization: string;
    department: string;
    patients: string[];
  }>(null);
  const [appointmentData, setAppointmentData] = useState([])
  useEffect(() => {
    const storedDoctor = localStorage.getItem("userData");

    if (!storedDoctor) return;

    try {
      const doctorData = JSON.parse(storedDoctor);
      const doctorId = doctorData._id;
      console.log('Doctor ID:', doctorId);

      const fetchDoctor = async () => {
        try {
          const res = await axios.get(`http://localhost:4000/api/doctor/${doctorId}`);
          console.log("Doctor's data:", res.data);
          setDoctor(res.data);

          // ✅ Delete doctorData after successful fetch
          // localStorage.removeItem("doctorData");
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        }
      };



      fetchDoctor();
    } catch (error) {
      console.error("Invalid JSON in doctorData:", error);
      // localStorage.removeItem("doctorData"); // Clean corrupted data
    }
  }, []);

  const fetchAppoointmentById = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userData') || '{}');
      const doctorId = user._id;
      const res = await axios.get(`http://localhost:4000/api/appointments/doctor/${doctorId}`);
      console.log(res.data.DoctorAppo, "This is appointment data");
      setAppointmentData(res.data.DoctorAppo);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    if (user?.role === 'doctor') {
      fetchAppoointmentById();
    }
  }, []);

  // Get today's date as YYYY-MM-DD string
const today = new Date();
const todayString = format(today, "yyyy-MM-dd");

// Filter appointments for today
const todaysAppointments = appointmentData.filter((appointment) => {
  const appointmentDate = new Date(appointment.date); // assuming `appointment.date` is a valid date string
  const appointmentDateString = format(appointmentDate, "yyyy-MM-dd");
  return appointmentDateString === todayString;
});



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
              value={appointmentData.length}
              description="under your care"
              icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 4, isPositive: true }}
            />
            <DashboardCard
              title="Today's Appointments"
              value="12"
              description="3 pending confirmations"
              icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 0, isPositive: true }}
            />
            <DashboardCard
              title="Cancer Detection Tests"
              value="9"
              description="this week"
              icon={<ClipboardIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 2, isPositive: true }}
            />
            <DashboardCard
              title="Medical Records"
              value="438"
              description="total records"
              icon={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 12, isPositive: true }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DoctorPredictionsChart className="lg:col-span-2" />
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {appointmentData.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between space-x-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {appointment.date}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{appointment.patientId.firstName}  {appointment.patientId.lastName}</p>
                          <p className="text-xs text-muted-foreground">{appointment.notes}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>

          </div>

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
            onRefresh={fetchAppoointmentById}
          />
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <DoctorPatientList patientData={appointmentData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}