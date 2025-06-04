import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Hospital Pro has completely transformed our administrative workflow. We've reduced paperwork by 85% and improved patient satisfaction scores.",
    author: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    avatar: "SJ"
  },
  {
    quote: "As a doctor, the intuitive interface helps me manage my patient appointments and records efficiently, giving me more time to focus on patient care.",
    author: "Dr. Michael Chen",
    role: "Cardiologist",
    avatar: "MC"
  },
  {
    quote: "The patient portal is user-friendly and gives me easy access to my appointments and test results. I feel more involved in my healthcare journey.",
    author: "Robert Wilson",
    role: "Patient",
    avatar: "RW"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by Healthcare Professionals
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            See what our users have to say about Hospital Pro
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-lg">
              <CardContent className="p-8">
                <div className="relative">
                  <svg 
                    className="absolute -top-8 -left-6 h-16 w-16 text-blue-100" 
                    fill="currentColor" 
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative text-lg text-slate-700 mb-6">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center mt-6">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="text-base font-medium text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}