"use client"
import React from 'react'
import { useAdminData } from '@/app/context/AdminDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const events = [
  {
    date: "Today",
    time: "09:00 - 09:30",
    name: "Rosemarie Smitham",
    email: "rosemarie21@gmail.com",
    eventType: "Cansas Studio\nNew Inquiry Discussions",
    attendance: "1 Host\n2 non-hosts",
  },
  {
    date: "Today",
    time: "10:00 - 10:30",
    name: "James Lockman",
    email: "jamesloc@gmail.com",
    eventType: "Refining User Interface Elements",
    attendance: "1 Host\n2 non-hosts",
  },
  {
    date: "Tomorrow",
    time: "13:00 - 14:30",
    name: "Wilson Kovacek",
    email: "wilsonkov@gmail.com",
    eventType: "Ensuring Alignment with Client Vision",
    attendance: "1 Host\n2 non-hosts",
  },
  {
    date: "Tomorrow",
    time: "17:00 - 18:00",
    name: "Elena Connelly",
    email: "elena@gmail.com",
    eventType: "Cansas Studio\nNew Inquiry Discussions",
    attendance: "1 Host\n2 non-hosts",
  },
  {
    date: "Thu,14 Dec",
    time: "09:00 - 09:30",
    name: "Enrique Grady",
    email: "enrique89@gmail.com",
    eventType: "Analyzing User Interactions and Feedback",
    attendance: "1 Host\n2 non-hosts",
  },
  {
    date: "Thu,14 Dec",
    time: "10:00 - 11:30",
    name: "Pearl Moore",
    email: "pearl98@gmail.com",
    eventType: "Defining Design Objectives and Goals",
    attendance: "1 Host\n2 non-hosts",
  },
  {
    date: "Fri,15 Dec",
    time: "13:00 - 13:30",
    name: "Tyler Tillman",
    email: "tyler@gmail.com",
    eventType: "Cansas Studio\nNew Inquiry Discussions",
    attendance: "1 Host\n2 non-hosts",
  },
];

export default function ShowAppointment() {
    const {appointments} = useAdminData()
  return (
    <div className="p-6">
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center">
          <div className="text-gray-500">Date Range ▼</div>
          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <TabsContent value="upcoming">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div>{event.date}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </TableCell>
                  <TableCell>
                    <div>{event.name}</div>
                    <div className="text-xs text-blue-500">{event.email}</div>
                  </TableCell>
                  <TableCell>
                    {event.eventType.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {event.attendance.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto text-blue-600">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="pending">
          <p className="text-muted-foreground">No pending events.</p>
        </TabsContent>

        <TabsContent value="past">
          <p className="text-muted-foreground">No past events.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
