'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

type Doctor = {
  _id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  availableSlots?: string[];
};

export default function SetAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("🚫 No token found in localStorage");
          toast({
            title: "Unauthorized",
            description: "Please log in again.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        const res = await axios.get('http://localhost:4000/api/doctor', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(res.data,"tjis is doctor data");
        setDoctors(res.data.doctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        toast({
          title: "Error",
          description: "Failed to load doctors list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async (doctorId: string) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your appointment",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get patient info from local storage or context
      const patientDataStr = localStorage.getItem('patientData');
      if (!patientDataStr) {
        // handle not logged in (toast + redirect)
        return;
      }
      const patient = JSON.parse(patientDataStr);

      // Create appointment
      const appointmentRes = await axios.post('http://localhost:4000/api/appointments/create', {
        doctorId,
        patientId: patient._id,
        date: selectedDate.toISOString(),
        notes: "health checkup"
      });



      // Send notification to doctor
      await axios.post('http://localhost:4000/api/notification', {
        recipient: doctorId,
        sender: patient._id,
        type: 'appointment',
        title: 'New Appointment Request',
        message: `${patient.firstName} has requested an appointment on ${format(selectedDate, 'PPP')} at ${selectedTime}`,
        relatedEntity: appointmentRes.data._id
      });

      toast({
        title: "Appointment Requested",
        description: `Doctor has been notified about your appointment request.`,
      });

      router.push("/patient/dashboard")
    } catch (err) {
      console.error('Error booking appointment:', err);
      toast({
        title: "Error",
        description: "Failed to book the appointment",
        variant: "destructive",
      });
    }
  };

  const getAvailableTimeSlots = (doctorId: string) => {
    const doctor = doctors.find(d => d._id === doctorId);
    return doctor?.availableSlots || [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="hover:shadow-lg transition duration-300">
              <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar>
                  <AvatarImage src={doctor.avatar} />
                  {/* <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback> */}
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{doctor.firstName} {doctor.lastName}</CardTitle>
                  <Badge variant="outline">{doctor.specialization}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Department:</strong> {doctor.department}</p>
                <p className="text-sm mb-2"><strong>Contact:</strong> {doctor.phone}</p>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-2">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDoctor === doctor._id && selectedDate ? (
                        format(selectedDate, 'PPP')
                      ) : (
                        'Select date'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDoctor === doctor._id ? selectedDate : undefined}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedDoctor(doctor._id);
                        setSelectedTime('');
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {selectedDoctor === doctor._id && selectedDate && (
                  <div className="mt-4">
                    <Select onValueChange={setSelectedTime} value={selectedTime}>
                      <SelectTrigger>
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTimeSlots(doctor._id).map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleBookAppointment(doctor._id)}
                  disabled={!selectedDate || !selectedTime || selectedDoctor !== doctor._id}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}