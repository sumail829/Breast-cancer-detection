import express from "express"
import { Notification } from "../models/notification.js";



export const getDoctorNotifications = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const notifications = await Notification.find({ recipient: doctorId }).sort({ createdAt: -1 });

    return res.status(200).json({ notifications });
  } catch (error) {
  console.log("Something went wrong",error);
  return res.status(500).json({ message: "Internal server error" });
}

};
