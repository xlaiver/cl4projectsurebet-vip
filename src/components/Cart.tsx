import React from 'react';
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem } from '../App';

type CartProps = {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  total: number;
};

const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  onContinueShopping,
  total 
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <ShoppingBag size={64} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-400 mb-6">Adicione alguns planos para continuar</p>
        <button 
          onClick={onContinueShopping}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Ver Planos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-400">Seu Carrinho</h2>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4">Plano</th>
              <th className="text-center p-4">Quantidade</th>
              <th className="text-right p-4">Preço</th>
              <th className="text-right p-4">Subtotal</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.product.id} className="border-t border-gray-700">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-400">R$ {item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center">
                    <button 
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right">
                  R$ {item.product.price.toFixed(2)}
                </td>
                <td className="p-4 text-right font-medium">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <button 
          onClick={onContinueShopping}
          className="mb-4 md:mb-0 text-green-400 hover:text-green-500 flex items-center space-x-1"
        >
          <ShoppingBag size={18} />
          <span>Continuar Comprando</span>
        </button>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full md:w-auto border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Subtotal:</span>
            <span className="font-medium">R$ {total.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-green-400">R$ {total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 hover:bg-green-700 transition"
          >
            <CreditCard size={18} />
            <span>Finalizar Compra</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;