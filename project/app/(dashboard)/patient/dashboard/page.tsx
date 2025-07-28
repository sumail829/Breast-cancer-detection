'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, ClipboardIcon, FileTextIcon, MessageSquare, Microscope } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import PatientAppointments from '@/components/dashboard/patient/patient-appointments';
import PatientTestResultsList from '@/components/dashboard/patient/patient-test-results';
import Link from 'next/link';
import axios from 'axios';
import ChatBox from '@/components/landing/chatbox';

export default function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewhistory, setViewHistory] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [doctorChats, setDoctorChats] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
const[loading,setLoading]=useState(false);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
    setUser(storedUser);
    const currentPatientId = storedUser._id;

    const fetchMedicalHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/patients/${currentPatientId}`);
        setViewHistory(res.data.patients);
      } catch (error) {
        console.log("something went wrong fetching history", error);
      }
    };

    const fetchDoctorDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/records/patient/${currentPatientId}`);
        setPatientData(res.data.records[0]);
      } catch (error) {
        console.log("something went wrong fetching doctor data", error);
      }
    };

    fetchMedicalHistory();
    fetchDoctorDetails();
  }, []);

  const doctorId = patientData?.doctorId?._id;
  const patientId = user?._id;

  // useEffect(() => {
  //   async function fetchDoctorChats() {
  //     const res = await axios.get(`http://localhost:4000/api/chat/partners/patient/${patientId}`);
  //     setDoctorChats(res.data);
  //     if (res.data.length > 0) setSelectedDoctorId(res.data[0]._id);
  //   }
  //   fetchDoctorChats();
  // }, [patientId]);

  const handleNewScreeningPayment = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/initialize-khalti", {});
      const paymentUrl = res.data?.payment?.payment_url;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Failed to initiate Khalti payment");
      }
    } catch (err) {
      console.error("Payment Error", err);
      alert("Error initializing payment");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-6">
            {/* My Doctor Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>My Doctor</CardTitle>
                <CardDescription>Your assigned healthcare provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">Dr</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-medium">
                      {patientData?.doctorId?.firstName} {patientData?.doctorId?.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{patientData?.doctorId?.specialization}</p>
                    <div className="flex items-center justify-center space-x-1 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setShowChat(true)}>
                    Contact Doctor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Schedule Appointment */}
                  <QuickActionCard
                    title="Schedule Appointment"
                    desc="Book your next visit"
                    icon={<CalendarIcon className="h-5 w-5 text-blue-600" />}
                    href="/patient/setappointment"
                  />
                  {/* Cancer Screening */}
                  <QuickActionCard
                    title="Cancer Screening"
                    desc="Upload images for AI analysis"
                    icon={<Microscope className="h-5 w-5 text-purple-600" />}
                    href="/patient/cancer-detection"
                  />
                  {/* View Test Results */}
                  <QuickActionCard
                    title="View Test Results"
                    desc="Check your latest results"
                    icon={<ClipboardIcon className="h-5 w-5 text-green-600" />}
                    href="/patient/viewresult"
                  />
                  {/* Medical History */}
                  <QuickActionCard
                    title="Medical History"
                    desc="Access your records"
                    icon={<FileTextIcon className="h-5 w-5 text-orange-600" />}
                    href="/patient/view-medical-history"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <select onChange={e => setSelectedDoctorId(e.target.value)} value={selectedDoctorId}>
              {doctorChats.map(doc => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.firstName} {doc.lastName}
                </option>
              ))}
            </select>
            {selectedDoctorId && (
              <ChatBox
                doctorId={selectedDoctorId}
                patientId={patientId}
                userRole="patient"
                doctorName={`Dr. ${doctorChats.find(d => d._id === selectedDoctorId).firstName}`}
                patientName={patientName}
              />
            )}
          </div>
          {/* Chat Floating UI */}
          {showChat && doctorId && patientId && (

            <div
              style={{
                position: 'fixed',
                bottom: 20,
                left: 20,
                zIndex: 1000,
                width: 370,
                height: 400,
                background: 'white',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #eee',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Chat with Doctor</span>
                <button
                  onClick={() => setShowChat(false)}
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
                doctorId={doctorId}
                patientId={patientId}
                doctorName={`Dr. ${patientData?.doctorId?.firstName} ${patientData?.doctorId?.lastName}`}
                patientName={`${user?.firstName} ${user?.lastName}`}
                userRole="patient"
                style={{ flex: 1 }}
              />
            </div>
          )}

          {/* Floating Button */}
          <Button
            variant="default"
            size="icon"
            onClick={() => setShowChat((prev) => !prev)}
            aria-label="Open chat"
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
            <MessageSquare size={28} />
          </Button>
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
              <CardDescription>Your complete medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 text-muted-foreground text-lg">
                Medical records placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
              {/* <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/patient/test-results">View Report</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/patient/cancer">New Screening</Link>
                </Button>
              </div> */} <div>
                  Charge:Rs 500
                </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" asChild>
                  <a href="/patient/test-results">View Report</a>
                </Button>
               

                <Button className="flex-1" onClick={handleNewScreeningPayment} disabled={loading}>
                  {loading ? "Redirecting..." : "New Screening"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ✅ Quick Action Card (Reusable Component)
function QuickActionCard({ title, desc, icon, href }: { title: string; desc: string; icon: React.ReactNode; href: string }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-full bg-gray-100">{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={href}>Go</Link>
      </Button>
    </div>
  );
}
