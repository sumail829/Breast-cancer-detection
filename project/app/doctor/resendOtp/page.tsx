'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResendOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('doctorEmail');
    if (!storedEmail) {
      alert('No email found. Please login again.');
      router.push('/doctor/login');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/resend-otp`, { email });
      router.push('/doctor/verifyOtp');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-md">
        <CardHeader>
          <CardTitle>Resend OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResendOtp} className="flex flex-col gap-4">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email (read-only)
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
            <Button type="submit" className="mt-4 w-full">
              Resend OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
