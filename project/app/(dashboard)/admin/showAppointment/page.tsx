"use client"
import React from 'react'
import { useAdminData } from '@/app/context/AdminDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


export default function ShowAppointment() {
    const {appointments} = useAdminData()
    console.log(appointments,"this is appointment")

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
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((event, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div>{event.date}</div>
                    {/* <div className="text-xs text-muted-foreground">{event.time}</div> */}
                  </TableCell>
                  <TableCell>
                    <div>{event.name}</div>
                    <div className="text-xs text-blue-500">{event.patientId.email}</div>
                  </TableCell>
               
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto text-blue-600">{event.status}</Button>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-blue-500">{event.notes}</div>
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
