import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types of alerts
type AlertType = 'error' | 'warning' | 'info' | 'success';

// Define the context type with showAlert function
interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void;
}

// Create the context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// AlertProvider component
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType>('info'); // Default alert type

  // Function to show the alert with a message and type
  const showAlert = (message: string, type: AlertType) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 5000); // Hide alert after 5 seconds
  };

  // Function to get alert styles based on type
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'error':
        return 'text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800';
      case 'warning':
        return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-800';
      case 'info':
        return 'text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800';
      case 'success':
        return 'text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800';
      default:
        return 'text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Render the alert only if there is a message */}
      {alertMessage && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-sm p-4 mb-4 text-sm rounded-lg ${getAlertStyles(alertType)}`}
          role="alert"
        >
          <div className="flex items-center">
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Icons can be customized based on alert type */}
              <path
                fillRule="evenodd"
                d="M18 13a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v6zm-2 1V7H4v6h12zm-8-2a1 1 0 10-2 0 1 1 0 002 0zm6-1a1 1 0 11-2 0 1 1 0 012 0zm-6-3a1 1 0 10-2 0 1 1 0 002 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div>
              <span className="font-medium">{alertType.charAt(0).toUpperCase() + alertType.slice(1)}!</span> {alertMessage}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

// Custom hook to use the AlertContext
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
