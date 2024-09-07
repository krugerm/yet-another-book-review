import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiCheck, HiQuestionMarkCircle } from "react-icons/hi";

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
  const [alertType, setAlertType] = useState<AlertType>('success');
  const [openModal, setOpenModal] = useState(false);

  const showAlert = (message: string, type: AlertType) => {
    // console.log(`showAlert ${type}: ${message}`);
    setAlertMessage(message);
    setAlertType(type);
    setOpenModal(true);
  };

  // Function to get alert styles based on type
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'error':
        return 'text-red-700 dark:bg-red-200 dark:text-red-800';
      case 'warning':
        return 'text-yellow-700 dark:bg-yellow-200 dark:text-yellow-800';
      case 'info':
        return 'text-blue-700 dark:bg-blue-200 dark:text-blue-800';
      case 'success':
        return 'text-green-700 dark:bg-green-200 dark:text-green-800';
      default:
        return 'text-blue-700 dark:bg-blue-200 dark:text-blue-800';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">

            {alertType === 'success' ? <HiCheck className={`mx-auto mb-4 h-14 w-14 ${getAlertStyles(alertType)}`} /> 
            : alertType === 'error' ? <HiOutlineExclamationCircle className={`mx-auto mb-4 h-14 w-14 ${getAlertStyles(alertType)}`} /> 
            : alertType === 'warning' ? <HiOutlineExclamationCircle className={`mx-auto mb-4 h-14 w-14 ${getAlertStyles(alertType)}`} /> 
            : <HiQuestionMarkCircle className={`mx-auto mb-4 h-14 w-14 ${getAlertStyles(alertType)}`} />}

            <h3 id={`alert-message-${alertType}`} className={`mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 ${getAlertStyles(alertType)}`}>
              {alertMessage}
            </h3>

            <div className="flex justify-center gap-4">
              <Button id="alert-btn-ok" color="gray" onClick={() => setOpenModal(false)}>
                Ok
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      
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


export function Component() {
  const [openModal, setOpenModal] = useState(true);

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => setOpenModal(false)}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
