import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();


router.post("/initialize-khalti", async (req, res) => {
  const amount = 500 * 100; // amount in paisa

  try {
    const response = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      {
        return_url: process.env.KHALTI_RETURN_URL,
        website_url: process.env.KHALTI_WEBSITE_URL,
        amount,
        purchase_order_id: "screening_123",
        purchase_order_name: "Cancer Screening Test",
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY.replace(/"/g, "")}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, payment: response.data });
  } catch (error) {
    console.error("Khalti Init Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

export default router;