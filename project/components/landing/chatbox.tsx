'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

// Accept props for doctorId, patientId, userRole
export default function ChatBox({
  doctorId,
  patientId,
  userRole,
  doctorName = 'Doctor',
  patientName = 'Patient',
  style = {}
}: {
  doctorId: string;
  patientId: string;
  userRole: 'doctor' | 'patient';
  doctorName?: string;
  patientName?: string;
  style?: React.CSSProperties;
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const room = `${doctorId}_${patientId}`;
  
  // Get chat partner's name
  const chatPartnerName = userRole === 'doctor' ? patientName : doctorName;
  const currentUserName = userRole === 'doctor' ? doctorName : patientName;

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
const currentUserId = user?._id;


  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();

  }, [messages]);

  useEffect(() => {
  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/chat/history/${doctorId}/${patientId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  if (doctorId && patientId) {
    fetchChatHistory();
  }
}, [doctorId, patientId]);

  useEffect(() => {
    if (!doctorId || !patientId) return;

    socket.emit('join_room', room);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [doctorId, patientId, room]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      room,
      message,
      sender: userRole,
       senderId: currentUserId,
      senderName: currentUserName,
      timestamp: new Date().toISOString()
    };

    // Only emit to socket, don't add to local state
    // The message will come back through the receive_message event
    socket.emit('send_message', msgData);
    setMessage('');
  };

  if (!doctorId || !patientId) {
    return <p className="text-center text-sm text-gray-500">Waiting for participants...</p>;
  }

  return (
    <div className="border rounded p-4 w-full max-w-md bg-white shadow" style={style}>
      {/* Header with chat partner's name */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <h2 className="font-bold text-lg"> {chatPartnerName}</h2>
        <div className="text-xs text-gray-500 capitalize">
          You are: {currentUserName}
        </div>
      </div>

      {/* Messages container with auto-scroll */}
      <div className="h-64 overflow-y-auto border p-2 mb-3 bg-gray-50 rounded">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-20">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {messages.map((msg, index) => {
  const isOwnMessage = msg.senderId === currentUserId;

  return (
    <div key={index} className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <div className="text-xs text-gray-500 mb-1">
        {isOwnMessage ? 'You' : msg.senderName}
      </div>
      <div
        className={`inline-block px-3 py-2 rounded-lg max-w-[80%] text-sm ${
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        {msg.message}
      </div>
    </div>
  );
})}

        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Message ${chatPartnerName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}