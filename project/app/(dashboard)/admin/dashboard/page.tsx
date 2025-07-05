'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Calendar,
  FileCheck,
  User,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import AdminActivityChart from '@/components/dashboard/admin/activity-chart';
import AdminRecentActivity from '@/components/dashboard/admin/recent-activity';
import AdminPredictionsOverview from '@/components/dashboard/admin/predictions-overview';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/app/context/AdminDataContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { doctors, patients, appointments } = useAdminData();
  const router = useRouter();
  // const [doctors, setDoctors] = useState<any[]>([]);
  // const [patients, setPatients] = useState<any[]>([]);
  // const [appointment,setAppointment]=useState<any[]>([])


  // useEffect(()=>{

  //     const token = localStorage.getItem("token");

  //       if (!token) {
  //         console.warn("🚫 No token found in localStorage");
  //         toast({
  //           title: "Unauthorized",
  //           description: "Please log in again.",
  //           variant: "destructive",
  //         });
  //         router.push("/login");
  //         return;
  //       }
  //   const fetchAllDoctors=async()=>{
  //     try {
  //       const res=await axios.get("http://localhost:4000/api/doctor", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  //       console.log(res.data)
  //       setDoctors(res.data.doctors || []);
  //     } catch (error) {
  //       console.log("Something went wrong",error)
  //     }
  //   }
  //   const fetchAllPatients=async()=>{
  //     try {
  //       const res=await axios.get("http://localhost:4000/api/patients", {
  //         headers: {  
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  //       console.log(res.data)
  //       setPatients(res.data.patients || []);
  //     } catch (error) {
  //       console.log("Something went wrong",error)
  //     }
  //   }
  //   const fetchAllAppointment=async()=>{
  //     try {
  //       const res=await axios.get("http://localhost:4000/api/appointments");
  //       console.log(res.data.appointments);
  //       setAppointment(res.data.appointments)
  //     } catch (error) {
  //        console.log("Something went wrong",error)
  //     }
  //   }
  //   fetchAllDoctors();
  //   fetchAllPatients();
  //   fetchAllAppointment();
  // },[])


  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin! Here's what's happening in your hospital today.
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Doctors"
              value={doctors.length}
              description="since last month"
              icon={<User className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 15, isPositive: true }}

            />
            <DashboardCard
              title="Total Patients"
              value={patients.length}
              description="since last month"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 8, isPositive: true }}
            />
            <Link href="../admin/showAppointment" className="block">
              <DashboardCard
                title="Appointments"
                value={appointments.length}
                description="this week"
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: 3, isPositive: true }}
              />
            </Link>
            <DashboardCard
              title="Cancer Predictions"
              value="128"
              description="this month"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 5, isPositive: false }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Hospital Activity</CardTitle>
                <CardDescription>User activity over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AdminActivityChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pending Alerts</CardTitle>
                <CardDescription>Require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-1 bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Critical supply shortage</p>
                      <p className="text-sm text-muted-foreground">Surgical masks running low</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-1 bg-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Staff scheduling conflict</p>
                      <p className="text-sm text-muted-foreground">Pediatrics department understaffed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-1 bg-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">System maintenance</p>
                      <p className="text-sm text-muted-foreground">Scheduled for tonight at 2am</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminRecentActivity />
            <AdminPredictionsOverview />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center justify-center p-8 border rounded-md">
            <p className="text-lg text-muted-foreground">Analytics content placeholder</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-center p-8 border rounded-md">
            <p className="text-lg text-muted-foreground">Reports content placeholder</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}