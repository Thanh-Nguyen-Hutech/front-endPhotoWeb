import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import axiosClient from '../utils/axiosClient';
import { Send, Image as ImageIcon, Lock, Loader2 } from 'lucide-react';

const ChatRoom = ({ bookingId, currentUserId, currentUser, isPaid }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosClient.get(`/Messages/${bookingId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Lỗi lấy lịch sử chat:", error);
      }
    };
    fetchHistory();
  }, [bookingId]);

  useEffect(() => {
    let isMounted = true;

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7275/chatHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    const startConnection = async () => {
      try {
        await newConnection.start();
        
        if (isMounted) {
          await newConnection.invoke("JoinChatRoom", bookingId.toString());

          newConnection.on("ReceiveMessage", (senderName, message, imageUrl) => {
            setMessages(prev => [...prev, { senderName, message, imageUrl }]);
          });
        }
      } catch (e) {
        console.log('Lỗi khởi tạo SignalR: ', e);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (newConnection && newConnection.state === "Connected") {
         newConnection.stop();
      }
    };
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !connection) return;

    if (!currentUserId) {
        console.error("Lỗi: Không tìm thấy ID của người dùng (currentUserId đang undefined)!");
        alert("Lỗi xác thực người dùng, vui lòng tải lại trang.");
        return;
    }

    try {
      await connection.invoke(
        "SendMessage", 
        bookingId?.toString(), 
        currentUserId?.toString(), 
        currentUser, 
        inputText, 
        ""
      );
      setInputText('');
    } catch (e) {
      console.error("Lỗi gửi tin nhắn SignalR:", e);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isPaid) {
      alert("🔒 Chức năng gửi ảnh chỉ mở sau khi khách hàng đã thanh toán cọc!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await axiosClient.post('/Photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = uploadRes.data.url;
      await connection.invoke("SendMessage", bookingId.toString(), currentUserId.toString(), currentUser, "Đã gửi 1 tệp đính kèm", imageUrl);
      
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Không thể gửi ảnh lúc này.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-w-2xl mx-auto glass rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div>
          <h3 className="font-black text-white uppercase tracking-widest">Phòng Chat #{bookingId}</h3>
          <p className="text-[10px] text-photo-gold font-bold">
            Trạng thái: {isPaid ? "✅ Đã thanh toán (Mở khóa tệp)" : "🔒 Chưa thanh toán (Khóa tệp)"}
          </p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderName === currentUser;
          return (
            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-500 mb-1 font-bold">{msg.senderName}</span>
              
              <div className={`p-3 rounded-2xl max-w-[80%] shadow-md ${isMe ? 'bg-photo-gold text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                {msg.message && <p className="text-sm font-medium whitespace-pre-wrap">{msg.message}</p>}
                
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Đính kèm" className="mt-2 rounded-lg max-h-48 object-contain border border-white/20" />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-3">
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            id={`file-upload-${bookingId}`}
            className="hidden" 
            onChange={handleImageUpload}
            disabled={!isPaid || isUploading} 
          />
          <label 
            htmlFor={`file-upload-${bookingId}`}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer
              ${!isPaid 
                ? 'bg-red-500/20 text-red-500 cursor-not-allowed' 
                : 'bg-white/10 text-white hover:bg-photo-gold hover:text-black'}`}
            title={!isPaid ? "Chưa thanh toán cọc" : "Gửi ảnh"}
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : 
             !isPaid ? <Lock size={18} /> : <ImageIcon size={18} />}
          </label>
        </div>

        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-photo-gold transition-all"
        />

        <button 
          type="submit" 
          disabled={!inputText.trim()}
          className="bg-photo-gold text-black p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;