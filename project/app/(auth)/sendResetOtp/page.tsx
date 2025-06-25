'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type UserRole = 'admin' | 'doctor' | 'patient';

export default function SendResetOtpPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      switch (role) {
        case 'admin':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/send-reset-otp`;
          break;
        case 'doctor':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/send-reset-otp`;
          break;
        case 'patient':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/send-reset-otp`;
          break;
      }

      const res = await axios.post(endpoint, { email });

      if (!res.data.success) {
        setError(res.data.message || 'Unable to send OTP');
        return;
      }

      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetRole', role);
      alert('OTP sent successfully');

      // Redirect to correct reset page
      router.push(`/resetPassword`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Server error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Select Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                 <SelectValue>{role?.toUpperCase()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
              
                  <SelectItem value="doctor">DOCTOR</SelectItem>
                  {/* <SelectItem value="admin">ADMIN</SelectItem> */}
                  <SelectItem value="patient">PATIENT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
