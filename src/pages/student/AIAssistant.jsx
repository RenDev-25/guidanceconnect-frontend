
import React, { useState } from 'react';
import ChatWindow from '../../components/common/ChatWindow';
import { aiService } from '../../services/aiService';

const quickQuestions = [
  'How do I request a Good Moral Certificate?',
  'How do I book a counseling appointment?',
  'What are the counseling office hours?',
  'Where is the OGC office located?',
  'What are the requirements for a service?',
  'How can I check my request status?',
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am your OGC Virtual Assistant. How can I help you with guidance services, certificates, or appointments today?',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (question) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: cleanQuestion,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setIsLoading(true);

    try {
      // Uses the existing 600 ms delay inside aiService.
      const answer = await aiService.askAssistant(cleanQuestion);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: answer,
        },
      ]);
    } catch (error) {
      console.error('Unable to get AI assistant response:', error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'Sorry, I could not process your question. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">OGC AI Assistant</h3>
        <p className="text-muted mb-0">
          Ask questions about guidance services, appointments, and
          document requirements.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            quickQuestions={quickQuestions}
            placeholder="Ask a question about OGC services..."
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
