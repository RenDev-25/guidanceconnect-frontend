import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your OGC Virtual Assistant. How can I assist you with guidance services, certificates, or appointments today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'How do I request a Good Moral Certificate?',
    'What are the counseling office hours?',
    'How long does document verification take?',
    'Where is the OGC office located?'
  ];

  const getCannedResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('good moral')) {
      return 'To request a Good Moral Certificate, go to "Good Moral Request" in the sidebar, specify your purpose, number of copies, attach any required document, and submit. Processing takes 3-5 working days.';
    }
    if (q.includes('hours') || q.includes('time') || q.includes('open')) {
      return 'The Office of Guidance and Counseling (OGC) is open Monday through Friday, from 8:00 AM to 5:00 PM, excluding university holidays.';
    }
    if (q.includes('document') || q.includes('verification')) {
      return 'Document verification typically takes 1 to 2 business days once uploaded via the Document Upload page.';
    }
    if (q.includes('located') || q.includes('location') || q.includes('where')) {
      return 'The OGC office is located at the Student Services Building, 2nd Floor, Main Campus.';
    }
    return 'Thank you for your question. For detailed or specific inquiries, please submit an official Service Request or visit the OGC office directly.';
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getCannedResponse(query);
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">OGC AI Assistant</h3>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Card>
            {/* Suggested Question Chips */}
            <div className="mb-3">
              <small className="text-muted d-block mb-2 fw-semibold">Suggested Questions:</small>
              <div className="d-flex flex-wrap gap-2">
                {quickQuestions.map((chip, idx) => (
                  <button
                    key={idx}
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => handleSend(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <hr />

            {/* Chat Messages Area */}
            <div
              className="p-3 bg-light rounded mb-3 border overflow-auto"
              style={{ height: '380px' }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`p-3 rounded shadow-sm max-w-75 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-bottom-0'
                        : 'bg-white text-dark border rounded-bottom-0'
                    }`}
                    style={{ maxWidth: '75%' }}
                  >
                    <small className="d-block text-opacity-75 mb-1 fw-bold">
                      {msg.sender === 'user' ? 'You' : 'OGC Bot'}
                    </small>
                    <span>{msg.text}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-white text-muted border p-3 rounded shadow-sm">
                    <span className="spinner-dots">OGC Bot is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Controls */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="d-flex gap-2"
            >
              <input
                type="text"
                className="form-control"
                placeholder="Ask a question about OGC services..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" variant="primary" disabled={!input.trim()}>
                <i className="bi bi-send-fill me-1"></i> Send
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;