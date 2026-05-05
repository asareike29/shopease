import React from 'react';
import './ErrorMessage.css';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message-box">
      <AlertCircle className="error-icon" size={20} />
      <span className="error-text">{message}</span>
    </div>
  );
};

export default ErrorMessage;
