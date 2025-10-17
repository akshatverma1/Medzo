import { useState, useEffect, useRef } from "react";
import React from 'react';

export default function OpenChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const API_BASE = 'http://127.0.0.1:3000';

  // Load messages and set random name on component mount
  useEffect(() => {
    generateRandomName();
    fetchMessages();
    
    // Set up interval to fetch new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateRandomName = () => {
    const adjectives = ["Happy", "Sunny", "Clever", "Brave", "Gentle", "Swift", "Wise", "Calm"];
    const nouns = ["Panda", "Tiger", "Eagle", "Dolphin", "Phoenix", "Wolf", "Lion", "Fox"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    setSenderName(`${randomAdj}${randomNoun}${randomNumber}`);
  };

  // Fetch all messages from API
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/openchat`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      // Convert createdAt strings to Date objects and sort by latest first (newest at bottom)
      const formattedMessages = data.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
        timestamp: new Date(msg.createdAt)
      })).sort((a, b) => a.createdAt - b.createdAt); // Sort ascending so newest are at bottom
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError("Failed to load messages");
    }
  };

  // Send new message to API
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    setLoading(true);
    setError("");

    try {
      const messageData = {
        msg: newMessage,
        sender: senderName,
        receiver: "public",
        createdAt: new Date()
      };

      const response = await fetch(`${API_BASE}/api/openchat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const savedMessage = await response.json();
      
      // Add the new message to local state (will appear at bottom)
      setMessages(prev => [...prev, {
        ...savedMessage,
        createdAt: new Date(savedMessage.createdAt),
        timestamp: new Date(savedMessage.createdAt)
      }]);
      
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE}/api/openchat/${messageId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      setError("Failed to delete message");
    }
  };

  // Manual scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (senderName.trim()) {
      setIsNameSet(true);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = message.createdAt.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (!isNameSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Open Chat</h1>
            <p className="text-gray-600">Connect with the healthcare community</p>
          </div>
          
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your display name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={generateRandomName}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Random Name
              </button>
              <button
                type="submit"
                disabled={!senderName.trim()}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Chat
              </button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be respectful and professional</li>
              <li>• No personal health information</li>
              <li>• Share helpful insights and experiences</li>
              <li>• Maintain patient confidentiality</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area - Full Width */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl text-white">💬</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Community Chat</h1>
                <p className="text-gray-600">
                  <span className="text-green-500">●</span> {messages.length} messages • Live updates
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">You're chatting as</p>
                <p className="text-blue-600 font-semibold">{senderName}</p>
              </div>
              <button 
                onClick={() => setIsNameSet(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Change Name
              </button>
              <button 
                onClick={scrollToBottom}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2"
              >
                <span>Scroll to Bottom</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError("")}
                className="ml-4 text-red-700 hover:text-red-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Be the first to start the conversation!</p>
              </div>
            ) : (
              Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-gray-100 px-4 py-1 rounded-full">
                      <span className="text-sm font-medium text-gray-600">
                        {formatDate(new Date(date))}
                      </span>
                    </div>
                  </div>

                  {/* Messages for this date - New messages will appear at bottom */}
                  {dateMessages.map(message => (
                    <div 
                      key={message._id}
                      className={`flex ${
                        message.sender === senderName ? 'justify-end' : 'justify-start'
                      } mb-4`}
                    >
                      <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-sm relative group ${
                        message.sender === senderName 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                      }`}>
                        {/* Message sender name */}
                        {message.sender !== senderName && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-xs font-semibold ${
                              message.sender === senderName ? 'text-blue-100' : 'text-blue-600'
                            }`}>
                              {message.sender}
                            </span>
                          </div>
                        )}
                        
                        {/* Message text */}
                        <p className="text-sm whitespace-pre-wrap">{message.msg}</p>
                        
                        {/* Message timestamp and delete button */}
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            message.sender === senderName ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                          
                          {/* Delete button (only show for user's own messages) */}
                          {message.sender === senderName && (
                            <button
                              onClick={() => deleteMessage(message._id)}
                              className="opacity-0 group-hover:opacity-100 ml-2 text-xs text-red-300 hover:text-red-100 transition-opacity"
                              title="Delete message"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to the community..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={loading}
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || loading}
                  className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Messages are public and visible to everyone in the community. Be respectful and professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}