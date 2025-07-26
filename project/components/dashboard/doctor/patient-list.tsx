'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Dummy patient data
const patientDatas = [
  {
    id: "p1",
    firstName: "Emily",
    lastName: "Richards",
    gender: "female",
    age: 35,
    dateOfBirth: "1990-06-15",
    phone: "(555) 123-4567",
    email: "emily.richards@example.com",
    lastVisit: "2025-03-10",
    nextAppointment: "2025-04-15",
    cancerStatus: null,
  },
  {
    id: "p2",
    firstName: "John",
    lastName: "Smith",
    gender: "male",
    age: 45,
    dateOfBirth: "1980-02-20",
    phone: "(555) 234-5678",
    email: "john.smith@example.com",
    lastVisit: "2025-03-05",
    nextAppointment: "2025-04-15",
    cancerStatus: "benign",
  },
  {
    id: "p3",
    firstName: "Maria",
    lastName: "Garcia",
    gender: "female",
    age: 52,
    dateOfBirth: "1973-11-30",
    phone: "(555) 345-6789",
    email: "maria.garcia@example.com",
    lastVisit: "2025-03-08",
    nextAppointment: "2025-04-15",
    cancerStatus: "pending",
  },
  {
    id: "p4",
    firstName: "David",
    lastName: "Kim",
    gender: "male",
    age: 28,
    dateOfBirth: "1997-09-12",
    phone: "(555) 456-7890",
    email: "david.kim@example.com",
    lastVisit: "2025-02-28",
    nextAppointment: "2025-04-16",
    cancerStatus: null,
  },
  {
    id: "p5",
    firstName: "Sarah",
    lastName: "Johnson",
    gender: "female",
    age: 64,
    dateOfBirth: "1961-04-25",
    phone: "(555) 567-8901",
    email: "sarah.johnson@example.com",
    lastVisit: "2025-03-01",
    nextAppointment: null,
    cancerStatus: "malignant",
  },
  {
    id: "p6",
    firstName: "Michael",
    lastName: "Thompson",
    gender: "male",
    age: 41,
    dateOfBirth: "1984-07-17",
    phone: "(555) 678-9012",
    email: "michael.thompson@example.com",
    lastVisit: "2025-03-02",
    nextAppointment: "2025-04-16",
    cancerStatus: "benign",
  },
  {
    id: "p7",
    firstName: "Jennifer",
    lastName: "Lee",
    gender: "female",
    age: 38,
    dateOfBirth: "1987-12-05",
    phone: "(555) 789-0123",
    email: "jennifer.lee@example.com",
    lastVisit: "2025-02-25",
    nextAppointment: "2025-04-17",
    cancerStatus: null,
  },
];

export default function DoctorPatientList({patientData}) {
  const [searchQuery, setSearchQuery] = useState('');


  
  const filteredPatients = patientData.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           patient.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getCancerStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'benign':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'malignant':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      default:
        return null;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Patients</CardTitle>
          <CardDescription>
            Manage and view information about your patients
          </CardDescription>
        </div>
        <Button size="sm">Add Patient</Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Next Appointment</TableHead>
              <TableHead>Cancer Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.firstName}{patient.lastName}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium"> {patient.patientId.firstName}{patient.patientId.lastName}</div>
                      <div className="text-xs text-muted-foreground">ID: {patient.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{patient.patientId.age}</div>
                  <div className="text-xs text-muted-foreground">
                    {patient.patientId.gender === 'male' ? 'Male' : 'Female'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{patient.patientId.phone}</div>
                  <div className="text-xs text-muted-foreground">{patient.patientId.email}</div>
                </TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>{patient.date || "Not scheduled"}</TableCell>
                <TableCell>
                  {getCancerStatusBadge(patient.cancerStatus) || "Not tested"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}