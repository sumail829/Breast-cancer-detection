// User roles
export type UserRole = 'admin' | 'doctor' | 'patient';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
}

// Doctor interface
export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  department: string;
  phone: string;
  patients: Patient[];
}

// Patient interface
export interface Patient extends User {
  role: 'patient';
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  phone: string;
  address: string;
  emergencyContact?: string;
  assignedDoctor?: Doctor;
  medicalHistory: MedicalRecord[];
}

// Admin interface
export interface Admin extends User {
  role: 'admin';
  department: string;
  phone: string;
}

// Appointment interface
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

// Medical Record interface
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  date: Date;
}

// Breast Cancer Prediction interface
export interface BreastCancerPrediction {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  result: 'benign' | 'malignant' | 'pending';
  confidence?: number;
  notes?: string;
}

// Dashboard card data
export interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}




























































































 



