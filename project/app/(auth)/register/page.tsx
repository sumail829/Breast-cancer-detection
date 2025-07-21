'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/lib/types';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContact: '',
    assignedDoctor: '',
    password: '',
    confirmPassword: '',
    specialization:'',
    department:'',
    role: 'patient' as UserRole,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are identical',
      });
      setIsLoading(false);
      return;
    }

    try {
      let endpoint = '';
      switch (formData.role) {
        case 'admin':
          endpoint= "http://localhost:4000/api/admin/signup";
          break;
        case 'doctor':
          endpoint= "http://localhost:4000/api/doctor/signup";
          break;
        case 'patient':
          endpoint= "http://localhost:4000/api/patients/signup";
          
          break;
      }
      console.log("Login API endpoint:", endpoint);


      const response = await axios.post(endpoint, {
        ...formData,
        age: Number(formData.age),
      })
      console.log(response);
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. You can now log in.',
      });
      localStorage.setItem("otpEmail", formData.email);
      router.push('/verify-otp');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error?.response?.data?.message || 'An error occurred during registration',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">

          <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Enter your information to register</CardDescription>
        </CardHeader>

        <div className="col-span-2 space-y-2 p-6">
              <Label htmlFor="role">Register As</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
        <form onSubmit={handleRegister}>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input name="age" type="number" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={handleGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
            </div>
            {formData.role === 'patient' && (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="assignedDoctor">Assigned Doctor (Optional)</Label>
                <Input name="assignedDoctor" value={formData.assignedDoctor} onChange={handleChange} />
              </div>
            )}
            {formData.role ==='doctor'&& (
             <div className="col-span-2 space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input name="specialization" value={formData.specialization} onChange={handleChange} />
              </div>
            )}
            {formData.role ==='doctor'&& (
             <div className="col-span-2 space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input name="department" value={formData.department} onChange={handleChange} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            {/* <div className="col-span-2 space-y-2">
              <Label htmlFor="role">Register As</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
