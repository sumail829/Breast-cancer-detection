import Patient from "../models/patient.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';


//Create a patient
export const createPatient = async (req, res) => {
  try {
    const {
      firstName, lastName, age, email, dateOfBirth, gender, bloodGroup, phone, address, emergencyContact, assignedpatient, password, confirmPassword
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !age || !email || !dateOfBirth || !gender || !phone || !address || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

     const hashedPassword = await bcrypt.hash(password, 10);
    

    // Create new patient instance
    const newPatientData = {
      firstName,
      lastName,
      age,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      password : hashedPassword,
      confirmPassword :hashedPassword,
    };
      const token = jwt.sign({ id: newPatient._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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


    if (assignedpatient && mongoose.Types.ObjectId.isValid(assignedpatient)) {
      newPatientData.assignedpatient = assignedpatient;
    }

    const newPatient = new Patient(newPatientData);

    // Save to DB
    const savedPatient = await newPatient.save();

    res.status(201).json({
      message: "Patient created successfully",
      patient: savedPatient,
    });
  } catch (error) {
    console.error("Error creating patients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//login patients 
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }
    const patient = await Patient.findOne({ email: email })
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }
    if (patient.password !== password) {
      return res.status(401).json({ message: "Invalid password" })
    }

     // Create JWT
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Set token in cookie so `patientId` is accessible in `patientAuth`
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000, // shorter expiry until OTP verified
    });

    // If not verified, send OTP
    if (!patient.isAccountVerified) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      patient.verifyOtp = otp;
      patient.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
      await patient.save();

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: patient.email,
        subject: 'Account verification OTP',
        text: `Your OTP is ${otp}. Verify your account using this OTP.`
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: `OTP sent to ${patient.email}. Please verify to complete login.`,
        needVerification: true,
      });
    }

    // Already verified → full login
    return res.status(200).json({
      success: true,
      message: "Login successful",
      patient,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//verify the email using the otp
export const verifyEmail = async (req, res) => {
  const { patientId, otp } = req.body;

  if (!patientId || !otp) {
    return res.status(400).json({ success: false, message: 'Missing details' });
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'patient not found' });
    }

    if (patient.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (patient.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Mark as verified
    patient.isAccountVerified = true;
    patient.verifyOtp = '';
    patient.verifyOtpExpireAt = 0;

    await patient.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully' });

  } catch (error) {
    console.error("VerifyEmail Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
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



//check if patient is Authenticated
export const isAuthenticated = async (req, res) => {
  try {

    return res.json({ success: true, message: 'patient authenticated successfully' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}


// Send Resen OTP if expired 

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (patient.isAccountVerified) {
      return res.status(400).json({ success: false, message: 'Account already verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    patient.verifyOtp = otp;
    patient.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await patient.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: patient.email,
      subject: 'Resend OTP for Account Verification',
      text: `Your new OTP for verifying your account is: ${otp}. It is valid for 24 hours.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: `OTP resent to ${patient.email}` });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// send password reset otp 
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });

  }
  try {

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.json({ success: false, message: 'patient not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    patient.resetOtp = otp;
    patient.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

    await patient.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: patient.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for reseting your password is  ${otp}. Use this otp to proceed eith resesting your password.`
    }

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: 'OTP sent to your email' })

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

//Reset patient Password 

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP and new password are required ' });
  }
  try {

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.json({ success: false, message: 'patient not found ' });
    }
    if (patient.resetOtp === '' || patient.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP ' });
    }

    if (patient.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP expired ' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    patient.password = hashedPassword;
    patient.resetOtp = '';
    patient.resetOtpExpireAt = 0;

    await patient.save();

    return res.json({ success: true, message: 'Password has been reset successfully ' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getPatientData = async (req, res) => {
  try {
    const { PatientId } = req.body;
    const patient = await Patient.findById(PatientId);

    if (!patient) {
      return res.json({ success: false, message: 'patient not found' });
    }
    res.json({
      success: true,
      PatientData: {
        name: patient.firstName + ' ' + patient.lastName,
        isAccountVerified: patient.isAccountVerified
      }
    })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}







//get all patients 

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    if (!patients) {
      return res.status(404).json({ message: "No patients available" })
    }

    return res.status(200).json({ message: "patients fetched successfully", patients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}

export const getSinglePatients = async (req, res) => {
  try {
    const patients = await Patient.findById(req.params.id)
    if (!patients) {
      return res.status(404).json({ message: "No patients available" })
    }

    return res.status(200).json({ message: "patients fetched successfully", patients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server errors" });

  }
}


export const updateSinglePatients = async (req, res) => {
  try {
    const updatePatients = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatePatients) {
      return res.status(404).json({ message: "No patients Found" })
    }


    return res.status(200).json({ message: "patients deleted successfully", updatePatients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}


export const deleteSinglePatients = async (req, res) => {
  try {
    const deletePatients = await Patient.findByIdAndDelete(req.params.id)
    if (!deletePatients) {
      return res.status(404).json({ message: "No patients Found" })
    }


    return res.status(200).json({ message: "patients deleted successfully", deletePatients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}