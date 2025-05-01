import React, { useEffect, useState } from 'react';

const Alert = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!visible) return null;
  
  // Tailwind classes based on the alert type
  const alertClasses = {
    success: "bg-green-100 text-emerald-800 border-l-4 border-emerald-400",
    error: "bg-red-100 text-red-800 border-l-4 border-red-400"
  };
  
  return (
    <div className={`p-4 rounded mb-6 flex items-center justify-between ${alertClasses[type]}`}>
      {message}
    </div>
  );
};

export default Alert; 