'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import Link from 'next/link';

type UserRole = 'doctor' | 'patient' | 'admin';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 useEffect(() => {
  if (typeof window !== 'undefined') {
    const possibleRoles: UserRole[] = ['doctor', 'patient', 'admin'];
    for (const r of possibleRoles) {
      const storedEmail = localStorage.getItem(`${r}Email`);
      if (storedEmail) {
        setEmail(storedEmail);
        setRole(r);
        console.log('Using Role:', r);
        console.log('With Email:', storedEmail);
        break;
      }
    }
  }
}, []);



  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = '';
      switch (role) {
        case 'doctor':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/verify-account`;
          break;
        case 'patient':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/verify-account`;
          break;
        case 'admin':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/verify-account`;
          break;
        default:
          throw new Error('Unsupported role');
      }

      await axios.post(
        endpoint,
        { email, otp },
        { withCredentials: true }
      );
      // Optionally clear localStorage
localStorage.removeItem(`${role}Email`);
localStorage.removeItem('userRole');

      router.push(`/${role}/dashboard`);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-white to-blue-50 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} readOnly className="bg-gray-100" />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={role} readOnly className="bg-gray-100 capitalize" />
            </div>
            <div>
              <Label>Enter OTP</Label>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          <Link
            href={`/resendOtp`}
            className="block w-full mt-4 underline text-blue-600 hover:text-blue-800 text-center"
          >
            Resend OTP
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
