import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  ClipboardList, 
  FileText, 
  Bell, 
  Calendar, 
  BarChart 
} from "lucide-react";

const features = [
  {
    title: "User Management",
    description: "Comprehensive user management for administrators, doctors, and patients with role-based access control.",
    icon: <Users className="h-12 w-12 text-blue-500" />
  },
  {
    title: "Patient Records",
    description: "Securely store and manage patient records, including medical history, diagnosis, and treatment plans.",
    icon: <FileText className="h-12 w-12 text-blue-500" />
  },
  {
    title: "Appointment Scheduling",
    description: "Efficient appointment management system for booking, rescheduling, and cancellation.",
    icon: <Calendar className="h-12 w-12 text-blue-500" />
  },
  {
    title: "Medical Screening",
    description: "Advanced breast cancer screening system with prediction capabilities and result management.",
    icon: <ClipboardList className="h-12 w-12 text-blue-500" />
  },
  {
    title: "Notifications",
    description: "Real-time notifications for appointments, test results, and important updates.",
    icon: <Bell className="h-12 w-12 text-blue-500" />
  },
  {
    title: "Analytics",
    description: "Comprehensive analytics dashboard for monitoring hospital performance and patient statistics.",
    icon: <BarChart className="h-12 w-12 text-blue-500" />
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Comprehensive Features
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Hospital Pro offers a complete suite of tools to streamline hospital operations and improve patient care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border border-slate-200 transition-all duration-200 hover:shadow-md hover:border-blue-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-50 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}