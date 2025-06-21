'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
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

// Dummy data
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
    patientId: "p2",
    doctorId: "d1",
    date: new Date(2025, 3, 15, 11, 30),
    status: "scheduled",
    notes: "Following up on test results",
    createdAt: new Date(2025, 3, 10),
  },
  {
    id: "3",
    patientId: "p3",
    doctorId: "d1",
    date: new Date(2025, 3, 15, 14, 0),
    status: "scheduled",
    notes: "Breast cancer screening",
    createdAt: new Date(2025, 3, 11),
  },
  {
    id: "4",
    patientId: "p4",
    doctorId: "d1",
    date: new Date(2025, 3, 16, 9, 0),
    status: "scheduled",
    createdAt: new Date(2025, 3, 12),
  },
  {
    id: "5",
    patientId: "p5",
    doctorId: "d1",
    date: new Date(2025, 3, 16, 10, 0),
    status: "cancelled",
    notes: "Patient requested cancellation",
    createdAt: new Date(2025, 3, 12),
  },
  {
    id: "6",
    patientId: "p6",
    doctorId: "d1",
    date: new Date(2025, 3, 16, 11, 0),
    status: "completed",
    notes: "Prescribed medication for hypertension",
    createdAt: new Date(2025, 3, 13),
  },
  {
    id: "7",
    patientId: "p7",
    doctorId: "d1",
    date: new Date(2025, 3, 17, 14, 30),
    status: "scheduled",
    createdAt: new Date(2025, 3, 14),
  },
];

// Patient data to display names
const patients = {
  p1: "Emily Richards",
  p2: "John Smith",
  p3: "Maria Garcia",
  p4: "David Kim",
  p5: "Sarah Johnson",
  p6: "Michael Thompson",
  p7: "Jennifer Lee",
};

export default function DoctorAppointmentsList() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  
  const filteredAppointments = appointments.filter((appointment) => {
    const dateMatches = date 
      ? appointment.date.toDateString() === date.toDateString() 
      : true;
      
    const statusMatches = status === "all" || appointment.status === status;
    
    return dateMatches && statusMatches;
  });

  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Filter Appointments</CardTitle>
            <CardDescription>
              Select date and status to filter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointment Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Scheduled</span>
              <span className="font-medium">
                {appointments.filter(a => a.status === 'scheduled').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-medium">
                {appointments.filter(a => a.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cancelled</span>
              <span className="font-medium">
                {appointments.filter(a => a.status === 'cancelled').length}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-medium">Total</span>
              <span className="font-medium">
                {appointments.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              Manage your scheduled appointments
            </CardDescription>
          </div>
          <Button size="sm">
            Schedule New
          </Button>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-muted-foreground mb-2">No appointments found</div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or schedule a new appointment
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {patients[appointment.patientId as keyof typeof patients]}
                    </TableCell>
                    <TableCell>
                      {appointment.date.toLocaleDateString()} at{" "}
                      {appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        appointment.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {appointment.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      {appointment.status === "scheduled" && (
                        <Button variant="outline" size="sm">
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}