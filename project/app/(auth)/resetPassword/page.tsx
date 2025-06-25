'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserRole = 'admin' | 'doctor' | 'patient';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedRole = localStorage.getItem('resetRole') as UserRole | null;

    if (!storedEmail || !storedRole) {
      alert('Missing reset details. Please request reset OTP again.');
      router.push('/sendResetOtp');
    } else {
      setEmail(storedEmail);
      setRole(storedRole);
    }
  }, [router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      switch (role) {
        case 'admin':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/reset-password`;
          break;
        case 'doctor':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/reset-password`;
          break;
        case 'patient':
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/reset-password`;
          break;
        default:
          throw new Error('Invalid user role.');
      }

      const res = await axios.post(endpoint, {
        email,
        otp,
        newPassword,
        confirmNewPassword, 
      });

      if (!res.data.success) {
        setError(res.data.message || 'Failed to reset password');
        return;
      }

      alert('Password reset successful');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetRole');
      router.push(`/login`);
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
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <Input
              type="email"
              value={email}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
            <Input
              type="text"
              value={role}
              readOnly
              className="bg-gray-100 cursor-not-allowed uppercase"
            />
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
