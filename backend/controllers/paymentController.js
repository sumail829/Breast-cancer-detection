import axios from 'axios';
import Payment from '../models/Payment.js';
import dotenv from 'dotenv';

dotenv.config();

export const verifyKhaltiPayment = async (req, res) => {
    const { token, amount, patientId } = req.body;

    try {
        const khaltiResponse = await axios.post(
            'https://khalti.com/api/v2/payment/verify/',
            { token, amount, patientId },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        const transactionId = khaltiResponse.data.idx;

        // Save payment info
        const payment = new Payment({
            patientId,
            amount,
            transactionId,  
            status: 'Success',
        });

        await payment.save();

        res.status(200).json({
            success: true,
            message: '✅ Payment verified and saved',
            payment,
        });
    } catch (err) {
        console.error(err.response?.data || err.message);

        const payment = new Payment({
            patientId,
            amount,
            status: 'Failed',
        });

        await payment.save();

        res.status(400).json({
            success: false,
            message: '❌ Payment verification failed',
            error: err.response?.data || err.message,
        });
    }
};
