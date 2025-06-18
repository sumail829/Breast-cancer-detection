
import Doctor from "../models/doctor.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

// ✅ CREATE a doctor
export const createDoctor = async (req, res) => {

  const { specialization, department, phone, patient, email, password, firstName, lastName } = req.body;

  if (!specialization || !department || !phone || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });

  }
  try {
    const email = req.body.email?.trim().toLowerCase();
    const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res.json({ success: false, message: 'doctor already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      specialization,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      department,
      phone,
      patients: patient ? [patient] : [],
    });
    const token = jwt.sign({ id: newDoctor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // To send an email 

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Hospital Care',
      text: `Welcome to Hospital Care. Your account has been created with email id: ${email}`
    }
    await transporter.sendMail(mailOptions);

    await newDoctor.save();
    return res.status(200).json({ message: `Mail sent successfully to your email [${email}]`, newDoctor });
    
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//login doctors 
export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: "No doctor found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Set token in cookie so `doctorId` is accessible in `doctorAuth`
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000, // shorter expiry until OTP verified
    });

    // If not verified, send OTP
    if (!doctor.isAccountVerified) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      doctor.verifyOtp = otp;
      doctor.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
      await doctor.save();

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: doctor.email,
        subject: 'Account verification OTP',
        text: `Your OTP is ${otp}. Verify your account using this OTP.`
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: `OTP sent to ${doctor.email}. Please verify to complete login.`,
        needVerification: true,
      });
    }

    // Already verified → full login
    return res.status(200).json({
      success: true,
      message: "Login successful",
      doctor,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




//controller function for logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    return res.status(200).json({
      success: true, message: 'Logged out'
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

//verify the email using the otp
export const verifyEmail = async (req, res) => {
  const { doctorId, otp } = req.body;

  if (!doctorId || !otp) {
    return res.status(400).json({ success: false, message: 'Missing details' });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (doctor.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (doctor.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Mark as verified
    doctor.isAccountVerified = true;
    doctor.verifyOtp = '';
    doctor.verifyOtpExpireAt = 0;

    await doctor.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully' });

  } catch (error) {
    console.error("VerifyEmail Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//check if doctor is Authenticated
export const isAuthenticated = async (req, res) => {
  try {

    return res.json({ success: true, message: 'doctor authenticated successfully' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// send password reset otp 
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });

  }
  try {

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: 'doctor not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    doctor.resetOtp = otp;
    doctor.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

    await doctor.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: doctor.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for reseting your password is  ${otp}. Use this otp to proceed eith resesting your password.`
    }

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: 'OTP sent to your email' })

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

//Reset doctor Password 

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP and new password are required ' });
  }
  try {

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: 'doctor not found ' });
    }
    if (doctor.resetOtp === '' || doctor.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP ' });
    }

    if (doctor.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP expired ' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    doctor.password = hashedPassword;
    doctor.resetOtp = '';
    doctor.resetOtpExpireAt = 0;

    await doctor.save();

    return res.json({ success: true, message: 'Password has been reset successfully ' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getdoctorData = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.json({ success: false, message: 'doctor not found' });
    }
    res.json({
      success: true,
      doctorData: {
        name: doctor.firstName + ' ' + doctor.lastName,
        isAccountVerified: doctor.isAccountVerified
      }
    })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// ✅ READ all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ READ one doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("patients");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE doctor
export const updateDoctor = async (req, res) => {
  try {
    const { specialization, department, phone, patients } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { specialization, department, phone, patients },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE doctor
export const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
