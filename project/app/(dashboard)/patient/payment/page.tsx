'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Add a type declaration for window.KhaltiCheckout
declare global {
    interface Window {
        KhaltiCheckout?: any;
    }
}

export default function SimpleKhaltiPayment() {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const router = useRouter();

    const amount = 6000 * 100; // in paisa

    const initializeKhaltiPayment = async () => {
        setLoading(true);
        setPaymentStatus('');

        try {
            const config = {
                publicKey: process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY || 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
                productIdentity: 'screening_001',
                productName: 'Health Screening',
                productUrl: window.location.href,
                paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
                eventHandler: {
                    onSuccess(payload) {
                        setPaymentStatus('✅ Payment successful!');
                        verifyPayment(payload.token);
                    },
                    onError(error) {
                        setPaymentStatus('❌ Payment failed: ' + error.message);
                    },
                    onClose() {
                        setPaymentStatus('⚠️ Payment cancelled by user');
                    }
                }
            };

            const checkout = new window.KhaltiCheckout(config);
            checkout.show({ amount });
        } catch (error) {
            setPaymentStatus('❌ Failed to initialize payment');
           
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (token) => {
        const patientId = localStorage.getItem('patientId');
        try {
            const res = await fetch('/api/khalti/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    amount,
                    patientId: patientId,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setPaymentStatus('✅ Payment verified!');
                setTimeout(() => router.push('/patient/cancer'), 1500); // Redirect after delay
            } else {
                setPaymentStatus('❌ Verification failed');
            }
        } catch (err) {
            console.error(err);
            setPaymentStatus('❌ Error verifying payment');
        }
    };

    return (
        <>
            <Head>
                <title>Pay Rs. 6000 with Khalti</title>
                <script src="https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js"></script>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm text-center">
                    <h2 className="text-2xl font-bold mb-4 text-purple-700">Pay Rs. 6000</h2>
                    <p className="text-gray-600 mb-6">Click below to proceed with secure Khalti payment for your screening.</p>

                    {paymentStatus && (
                        <div className={`mb-4 p-3 rounded text-sm font-medium ${paymentStatus.includes('✅') ? 'bg-green-100 text-green-700' :
                                paymentStatus.includes('❌') ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>
                            {paymentStatus}
                        </div>
                    )}

                    <button
                        onClick={initializeKhaltiPayment}
                        disabled={loading}
                        className={`w-full py-3 text-white rounded-md font-medium ${loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Pay with Khalti'}
                    </button>
                </div>
            </div>
        </>
    );
}
