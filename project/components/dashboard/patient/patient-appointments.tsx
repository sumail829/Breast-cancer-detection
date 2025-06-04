'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from '@/lib/types';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';

// Dummy appointments data
const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    doctorId: "d1",
    date: new Date(2025, 3, 15, 10, 30),
    status: "scheduled",
    notes: "Regular checkup",
    createdAt: new Date(2025, 3, 10),
  },
  {
    id: "2",
    patientId: "p1",
    doctorId: "d2",
    date: new Date(2025, 3, 22, 9, 0),
    status: "scheduled",
    notes: "Mammogram screening",
    createdAt: new Date(2025, 3, 10),
  },
  {
    id: "3",
    patientId: "p1",
    doctorId: "d1",
    date: new Date(2025, 4, 5, 11, 15),
    status: "scheduled",
    notes: "Follow-up appointment",
    createdAt: new Date(2025, 3, 20),
  },
  {
    id: "4",
    patientId: "p1",
    doctorId: "d3",
    date: new Date(2025, 2, 18, 14, 0),
    status: "completed",
    notes: "Annual physical",
    createdAt: new Date(2025, 2, 10),
  },
  {
    id: "5",
    patientId: "p1",
    doctorId: "d1",
    date: new Date(2025, 2, 25, 10, 0),
    status: "completed",
    notes: "Cancer screening follow-up",
    createdAt: new Date(2025, 2, 15),
  },
  {
    id: "6",
    patientId: "p1",
    doctorId: "d4",
    date: new Date(2025, 1, 12, 15, 30),
    status: "cancelled",
    notes: "Consultation with specialist",
    createdAt: new Date(2025, 1, 5),
  },
];

// Doctor information
const doctors = {
  d1: {
    name: "Dr. Sarah Johnson",
    specialty: "Oncologist",
    location: "Main Building, Room 305",
  },
  d2: {
    name: "Dr. Michael Chen",
    specialty: "Radiologist",
    location: "Imaging Center, Room 210",
  },
  d3: {
    name: "Dr. Emily Rodriguez",
    specialty: "General Practitioner",
    location: "Main Building, Room 102",
  },
  d4: {
    name: "Dr. James Williams",
    specialty: "Oncology Specialist",
    location: "Cancer Center, Room 405",
  },
};

export default function PatientAppointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  
  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatches = status === "all" || appointment.status === status;
    return statusMatches;
  });

  const upcomingAppointments = filteredAppointments.filter(
    app => app.status === "scheduled" && app.date > new Date()
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastAppointments = filteredAppointments.filter(
    app => app.status === "completed" || app.status === "cancelled" || app.date <= new Date()
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Filter Appointments</CardTitle>
            <CardDescription>
              View your appointment history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="scheduled">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Calendar</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Upcoming</span>
              <span className="font-medium">
                {appointments.filter(a => a.status === 'scheduled' && a.date > new Date()).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">This month</span>
              <span className="font-medium">
                {appointments.filter(a => {
                  const now = new Date();
                  return a.date.getMonth() === now.getMonth() && 
                         a.date.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total visits</span>
              <span className="font-medium">
                {appointments.filter(a => a.status === 'completed').length}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Schedule New Appointment</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="space-y-6">
        {upcomingAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const doctor = doctors[appointment.doctorId as keyof typeof doctors];
                  
                  return (
                    <div key={appointment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div className="flex flex-col mb-4 md:mb-0">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {appointment.date.toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <p>
                            {appointment.date.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col mb-4 md:mb-0">
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      
                      <div className="flex flex-col mb-4 md:mb-0">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{doctor.location}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>
                Your appointment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppointments.map((appointment) => {
                    const doctor = doctors[appointment.doctorId as keyof typeof doctors];
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="font-medium">
                            {appointment.date.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.date.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                        </TableCell>
                        <TableCell>{appointment.notes || "General visit"}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}