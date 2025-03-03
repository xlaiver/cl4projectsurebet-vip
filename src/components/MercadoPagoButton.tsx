import React, { useEffect, useRef, useState } from 'react';
import { CartItem } from '../App';

interface MercadoPagoButtonProps {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: (paymentData: any) => void;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ 
  items, 
  customerInfo, 
  onPaymentSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const checkoutButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading and then success for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Add a button that simulates payment success
      if (checkoutButtonRef.current) {
        const button = document.createElement('button');
        button.className = 'w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition';
        button.textContent = 'Simular Pagamento com Sucesso';
        button.onclick = () => {
          onPaymentSuccess({ status: 'approved', id: 'mock-payment-' + Date.now() });
        };
        checkoutButtonRef.current.appendChild(button);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [items, customerInfo, onPaymentSuccess]);

  if (error) {
    return (
      <div className="bg-red-900 text-white p-4 rounded-md mb-4">
        <p>{error}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-2 bg-red-700 px-4 py-2 rounded-md hover:bg-red-800 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-300">Carregando opções de pagamento...</span>
        </div>
      )}
      <div ref={checkoutButtonRef} className="w-full"></div>
    </div>
  );
};

export default MercadoPagoButton;