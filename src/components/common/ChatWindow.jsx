import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPaperPlane, FaRobot, FaUser, FaInfoCircle } from 'react-icons/fa';

const ChatWindow = ({
  messages,
  onSendMessage,
  isLoading = false,
  quickQuestions = [],
  placeholder = "Type your question here...",
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestionClick = (question) => {
    if (!isLoading) {
      onSendMessage(question);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 d-flex flex-column" style={{ minHeight: '500px', maxHeight: '700px' }}>
      
      {/* 1. Disclaimer Banner (Crucial for Prototype) */}
      <div className="alert alert-warning mb-0 rounded-0 rounded-top d-flex align-items-center gap-2 py-2 px-3 border-0 border-bottom">
        <FaInfoCircle className="text-warning flex-shrink-0" />
        <small className="mb-0 text-dark fw-medium">
          <strong>Demo AI:</strong> This assistant uses canned placeholder responses for demonstration purposes. It is not connected to a live AI model.
        </small>
      </div>

      {/* 2. Message History Area */}
      <div className="card-body overflow-auto d-flex flex-column gap-3 p-4 bg-light bg-opacity-50">
        {messages.length === 0 ? (
          <div className="m-auto text-center text-muted">
            <div className="bg-white p-4 rounded-circle shadow-sm d-inline-block mb-3">
              <FaRobot size={40} className="text-primary" />
            </div>
            <h5 className="fw-bold text-dark">How can I help you today?</h5>
            <p className="small mb-0">Ask me about OGC services, appointments, or requirements.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id || index} 
                className={`d-flex gap-3 max-w-75 ${isUser ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
                style={{ maxWidth: '85%' }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {isUser ? (
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
                      <FaUser size={14} />
                    </div>
                  ) : (
                    <div className="bg-white text-primary border rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
                      <FaRobot size={16} />
                    </div>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div 
                  className={`p-3 shadow-sm ${
                    isUser 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-dark border'
                  }`}
                  style={{
                    borderRadius: '16px',
                    borderTopRightRadius: isUser ? '4px' : '16px',
                    borderTopLeftRadius: !isUser ? '4px' : '16px',
                  }}
                >
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            );
          })
        )}

        {/* 3. Loading / Typing Indicator */}
        {isLoading && (
          <div className="d-flex gap-3 align-self-start" style={{ maxWidth: '85%' }}>
            <div className="flex-shrink-0">
              <div className="bg-white text-primary border rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
                <FaRobot size={16} />
              </div>
            </div>
            <div 
              className="p-3 bg-white text-dark border shadow-sm d-flex align-items-center gap-1"
              style={{ borderRadius: '16px', borderTopLeftRadius: '4px' }}
            >
              <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ width: '0.5rem', height: '0.5rem' }}></div>
              <div className="spinner-grow spinner-grow-sm text-primary animation-delay-1" role="status" style={{ width: '0.5rem', height: '0.5rem', animationDelay: '0.2s' }}></div>
              <div className="spinner-grow spinner-grow-sm text-primary animation-delay-2" role="status" style={{ width: '0.5rem', height: '0.5rem', animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {/* Invisible div to scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Questions Chips */}
      {quickQuestions.length > 0 && (
        <div className="bg-white border-top p-3 pb-2 d-flex gap-2 flex-nowrap overflow-auto hide-scrollbar">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill flex-shrink-0"
              onClick={() => handleQuickQuestionClick(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* 5. Input Area */}
      <div className="card-footer bg-white border-top-0 p-3 pt-2">
        <form onSubmit={handleSend} className="input-group input-group-lg shadow-sm rounded-3">
          <input
            type="text"
            className="form-control border-end-0 fs-6"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}
          />
          <button
            className="btn btn-primary border-start-0 px-4"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            style={{ borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      text: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(['user', 'assistant']).isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  quickQuestions: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
};

export default ChatWindow;