'use client';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function ChatBox({
  doctorId,
  patientId,
  userRole,
  doctorName = 'Doctor',
  patientName = 'Patient',
  style = {}
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const room = `${doctorId}_${patientId}`;
const currentUserName = userRole === 'doctor' ? doctorName : patientName;
const chatPartnerName = userRole === 'doctor' ? patientName : doctorName;
const user = JSON.parse(localStorage.getItem("userData") || "{}");
const currentUserId = user?._id;

  useEffect(() => {
    if (!doctorId || !patientId) return;

    socketRef.current = io('http://localhost:4000', {
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current.emit('join_room', room);
    socketRef.current.on('receive_message', (data) => {
      setMessages(prev => {
        if (prev.some(m => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/chat/history/${doctorId}/${patientId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          ));
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
      }
    };

    fetchChatHistory();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [doctorId, patientId]);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
   if (typeof message !== 'string' || !message.trim()) return;

    const msgData = {
      _id: new Date().getTime().toString(),
      room,
      message,
      sender: userRole,
      senderId: currentUserId,
      senderName: currentUserName,
      timestamp: new Date().toISOString()
    };

    socketRef.current.emit('send_message', msgData);
    setMessage('');
  };

  if (!doctorId || !patientId) {
    return (
      <div className="p-4 text-center text-red-500">
        {!doctorId && "Doctor not selected"}
        {!patientId && "Patient not selected"}
      </div>
    );
  }

  return (
    <div className="border rounded p-4 w-full max-w-md bg-white shadow" style={style}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <h2 className="font-bold text-lg">{chatPartnerName}</h2>
        <div className="text-xs text-gray-500 capitalize">
          You are: {currentUserName}
        </div>
      </div>

      <div className="h-64 overflow-y-auto border p-2 mb-3 bg-gray-50 rounded">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-20">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {messages.map((msg) => {
          const isOwnMessage = msg.senderId === currentUserId;
          return (
            <div key={msg._id} className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
              <div className="text-xs text-gray-500 mb-1">
                {isOwnMessage ? 'You' : msg.senderName}
              </div>
              <div className={`inline-block px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'
              }`}>
                {msg.message}
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          id="message-input"
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Message ${chatPartnerName}...`}
          value={message}
         onChange={(e) => setMessage(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          onClick={sendMessage}
           disabled={!message || typeof message !== 'string' || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}