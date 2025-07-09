'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ActivityIcon,
  CalendarIcon,
  ClipboardIcon,
  ClockIcon,
  FileTextIcon,
  UserIcon,
  Microscope
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { Progress } from "@/components/ui/progress";
import PatientAppointments from '@/components/dashboard/patient/patient-appointments';
import PatientTestResultsList from '@/components/dashboard/patient/patient-test-results';
import Link from 'next/link';
import axios from 'axios';

export default function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewhistory, setViewHistory] = useState<any>(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const currentPatientId = localStorage.getItem("patientId");
        const res = await axios.get(`http://localhost:4000/api/patients/${currentPatientId}`);
        console.log(res.data, "this is patient medical data");
        const patient = res.data.patients;
        setViewHistory(patient);
      } catch (error) {
        console.log("something went wrong", error);
      }
    };
    fetchMedicalHistory();
  }, []);



  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome {viewhistory?.firstName} {viewhistory?.lastName}
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <Link href="/patient/setappointment"><TabsTrigger value="setappointment">Appointments</TabsTrigger></Link>
          <Link href="/patient/viewresult"><TabsTrigger value="viewresult">Test Results</TabsTrigger></Link>
          <Link href="/patient/view-medical-history"><TabsTrigger value="medical-records">Medical Records</TabsTrigger></Link>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Upcoming Appointments"
              value="2"
              description="Next: April 15, 2025"
              icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 0, isPositive: true }}
            />
            <DashboardCard
              title="Medical Records"
              value="12"
              description="Last updated: 3 days ago"
              icon={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardCard
              title="Test Results"
              value="5"
              description="2 new since last visit"
              icon={<ClipboardIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 40, isPositive: true }}
            />
            <DashboardCard
              title="Medications"
              value="3"
              description="Next refill: 7 days"
              icon={<ActivityIcon className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-6">

            {/* My doctor */}


            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>My Doctor</CardTitle>
                <CardDescription>Your assigned healthcare provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      Dr
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <h3 className="text-xl font-medium">
                      {viewhistory?.doctorId?.firstName ?? 'No Doctor Assigned'}
                    </h3>
                    <p className="text-sm text-muted-foreground">Oncologist</p>
                    <div className="flex items-center justify-center space-x-1 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19 10 15.27z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Contact Doctor</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Schedule Appointment</p>

                        <p className="text-sm text-muted-foreground">Book your next visit</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patient/setappointment">Schedule</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Microscope className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cancer Screening</p>
                        <p className="text-sm text-muted-foreground">Upload images for AI analysis</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patient/cancer-detection">Screen Now</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <ClipboardIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">View Test Results</p>
                        <p className="text-sm text-muted-foreground">Check your latest results</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patient/viewresult">View Results</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <FileTextIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Medical History</p>
                        <p className="text-sm text-muted-foreground">Access your records</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/patient/view-medical-history">View History</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Breast Cancer Screening</CardTitle>
                <CardDescription>Your latest test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Last Test</p>
                    <p className="text-sm text-muted-foreground">March 10, 2025</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Result</p>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-sm font-medium text-green-600">Benign</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Confidence</p>
                      <p className="text-sm font-medium">95%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Follow-up Recommended</p>
                      <p className="text-sm font-medium">6 months</p>
                    </div>
                  </div> */}
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/patient/test-results">View Report</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/patient/cancer">New Screening</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Treatment Progress</CardTitle>
                <CardDescription>Your current treatment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Medication Adherence</p>
                      <p className="text-sm text-muted-foreground">92%</p>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Appointment Attendance</p>
                      <p className="text-sm text-muted-foreground">100%</p>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Overall Wellness</p>
                      <p className="text-sm text-muted-foreground">85%</p>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="pt-2 space-y-1">
                    <p className="text-sm font-medium">Notes from your doctor:</p>
                    <p className="text-sm text-muted-foreground">
                      Patient showing good progress. Continue with prescribed medication and schedule regular checkups.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <PatientAppointments />
        </TabsContent>

        <TabsContent value="test-results" className="space-y-4">
          <PatientTestResultsList />
        </TabsContent>

        <TabsContent value="medical-records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                Your complete medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-lg text-muted-foreground">Medical records placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}