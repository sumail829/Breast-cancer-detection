'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

type UserRole = 'admin' | 'doctor' | 'patient';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    let endpoint = '';
    switch (role) {
      case 'patient':
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/login`;
        break;
      case 'doctor':
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/login`;
        break;
      case 'admin':
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`;
        break;
    }

    const response = await axios.post(
      endpoint,
      { email, password },
      { withCredentials: true }
    );

    // 🔁 Always clean and set correct role/email
    localStorage.removeItem('userRole');
    localStorage.removeItem('doctorEmail');
    localStorage.removeItem('patientEmail');
    localStorage.removeItem('adminEmail');
    localStorage.setItem('userRole', role);
    localStorage.setItem(`${role}Email`, email);

    toast({
      title: 'Login successful',
      description: `Welcome back, you are logged in as ${role}`,
    });

    const { needVerification } = response.data;

    if (needVerification) {
      router.push('/verifyOtp');
    } else {
      router.push(`/${role}/dashboard`);
    }
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: error?.response?.data?.message || 'An error occurred during login',
    });
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to Hospital Pro</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Login As</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue>{role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Link
              href="/sendResetOtp"
              className="text-sm text-blue-600 hover:text-blue-800 underline text-center"
            >
              Forget your password?
            </Link>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
