
import React, { useState, useCallback } from 'react';
// FIX: Import the Role enum to use for message roles.
import { ChatMessage as ChatMessageType, Role } from './types';
import { fetchAIResponse } from './services/api';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      // FIX: Use the Role enum for the 'assistant' role.
      role: Role.Assistant,
      content: 'Hello! How can I help you about your business in Japan?'}
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    // FIX: Use Role.User enum value instead of the string 'user' to fix the type error on line 19.
    const userMessage: ChatMessageType = { role: Role.User, content: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await fetchAIResponse(userInput);
      // FIX: Use Role.Assistant enum value instead of the string 'assistant' to fix the type error on line 25.
      const aiMessage: ChatMessageType = { role: Role.Assistant, content: aiResponse };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      // FIX: Use Role.Assistant enum value instead of the string 'assistant' to fix the type error on line 30.
      const errorMessage: ChatMessageType = { 
        role: Role.Assistant, 
        content: 'I apologize, but I seem to be having trouble connecting. Please check your connection or try again later.' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-[#1a1a1d] text-gray-200 font-sans h-screen">
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default App;
