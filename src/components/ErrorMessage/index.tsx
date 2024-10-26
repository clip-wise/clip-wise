import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className='error-message' role='alert'>
    <strong>Error: </strong>
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
