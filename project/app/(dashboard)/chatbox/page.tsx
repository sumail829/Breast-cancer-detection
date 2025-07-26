import ChatBox from "@/components/landing/chatbox";


export default function ChatPage() {
  return (
    <div className="p-8">
      <ChatBox doctorId="doc123" patientId="pat456" userRole="patient" />
    </div>
  );
}
