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

export const createNotification = async (req, res) => {
  try {
    const { recipient, sender, type, title, message, relatedEntity } = req.body;

    if (!recipient || !sender || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newNotification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      relatedEntity,
      read: false,
      createdAt: new Date(),
    });

    const savedNotification = await newNotification.save();
    res.status(201).json({ message: "Notification created", notification: savedNotification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
