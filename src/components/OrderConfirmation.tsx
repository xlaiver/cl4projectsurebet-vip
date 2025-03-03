import React from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { CartItem } from '../App';

type OrderConfirmationProps = {
  order: {
    items: CartItem[];
    total: number;
    customerInfo: any;
  };
  onContinueShopping: () => void;
};

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  order, 
  onContinueShopping 
}) => {
  // Generate a random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-900 mb-4">
          <Check size={32} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-green-400">Pedido Confirmado!</h2>
        <p className="text-gray-300">
          Obrigado pela sua compra. Seu pedido foi recebido e está sendo processado.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-700">
        <div className="p-4 bg-gray-700 border-b border-gray-600">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-green-400">Detalhes do Pedido</h3>
            <span className="text-sm text-gray-400">Pedido #{orderNumber}</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2 text-green-400">Informações do Cliente</h4>
              <p className="text-gray-300">{order.customerInfo.name}</p>
              <p className="text-gray-300">{order.customerInfo.email}</p>
              <p className="text-gray-300">{order.customerInfo.phone}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-green-400">Método de Pagamento</h4>
              <p className="text-gray-300">PIX</p>
              <p className="text-gray-300">Pagamento confirmado</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h4 className="font-medium mb-4 text-green-400">Itens do Pedido</h4>
            
            <ul className="divide-y divide-gray-700 mb-6">
              {order.items.map(item => (
                <li key={item.product.id} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden mr-4">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-400">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span className="text-green-400">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-300 mb-4">
          Um email de confirmação foi enviado para {order.customerInfo.email}
        </p>
        <button 
          onClick={onContinueShopping}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center mx-auto"
        >
          <ShoppingBag size={18} className="mr-2" />
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;