"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");
  if (!email || !otp) {
    setMessage("Please enter both email and OTP.");
    return;
  }
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:4000/api/patients/verify-otp", { email, otp });

    // axios treats non-2xx as errors, so if we're here, status is OK
    setMessage("OTP verified successfully! Redirecting...");
     localStorage.removeItem("otpEmail"); // ✅ Add this line
    setTimeout(() => {
      router.push("/login");
    }, 1500);

  } catch (error: any) {
    // axios errors have response data in error.response
    if (error.response && error.response.data && error.response.data.message) {
      setMessage(error.response.data.message);
    } else {
      setMessage("Error verifying OTP. Try again.");
    }
  }

  setLoading(false);
};

useEffect(() => {
  const savedEmail = localStorage.getItem("otpEmail");
  if (!savedEmail) {
    setMessage("No email found. Please register again.");
    setTimeout(() => router.push("/register"), 2000);
    return;
  }
  setEmail(savedEmail);
}, []);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-center text-2xl font-semibold mb-6">Verify OTP</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
           readOnly={!!email} // prevent editing if already set
        />
        <input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
