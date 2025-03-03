import React, { useState } from 'react';
import { ArrowLeft, Check, QrCode, Copy, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CartItem } from '../App';

type CheckoutProps = {
  items: CartItem[];
  total: number;
  onCompleteCheckout: (customerInfo: any) => void;
  onBackToCart: () => void;
};

const Checkout: React.FC<CheckoutProps> = ({ 
  items, 
  total, 
  onCompleteCheckout, 
  onBackToCart 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedPixCode, setCopiedPixCode] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteCheckout(formData);
  };
  
  const copyPixCode = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPixCode(true);
    setTimeout(() => setCopiedPixCode(false), 3000);
  };
  
  // Get the PIX code from the first item in the cart
  // In a real app, you might want to handle multiple items differently
  const pixCode = items.length > 0 ? items[0].product.pixCode : '';
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-400">Finalizar Compra</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-700">
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <h3 className="font-medium text-green-400">Informações do Cliente</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 text-white"
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4 text-green-400">Pagamento via PIX</h3>
                
                <div className="bg-gray-700 p-6 rounded-lg mb-6">
                  {formData.name && formData.email && formData.phone ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg mb-4">
                        {pixCode && (
                          <QRCodeSVG 
                            value={pixCode} 
                            size={200}
                            level="H"
                          />
                        )}
                      </div>
                      
                      <p className="text-center mb-4 text-gray-300">
                        Escaneie o QR Code acima com o aplicativo do seu banco para pagar
                      </p>
                      
                      <div className="w-full">
                        <p className="text-sm text-gray-400 mb-1">Ou copie e cole o código PIX:</p>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={pixCode}
                            readOnly
                            className="flex-grow px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-gray-300 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => copyPixCode(pixCode || '')}
                            className="bg-green-600 text-white px-3 py-2 rounded-r-md hover:bg-green-700 transition"
                          >
                            {copiedPixCode ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                        </div>
                        {copiedPixCode && (
                          <p className="text-green-400 text-sm mt-1">Código PIX copiado!</p>
                        )}
                      </div>
                      
                      <div className="mt-6 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300">Após realizar o pagamento:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaymentConfirmed(true)}
                          className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition flex items-center justify-center"
                        >
                          <Smartphone size={18} className="mr-2" />
                          Já realizei o pagamento
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-yellow-400 text-center">
                      Preencha seus dados pessoais para visualizar o QR Code de pagamento
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={onBackToCart}
                  className="flex items-center text-green-400 hover:text-green-500"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Voltar ao Carrinho
                </button>
                
                {paymentConfirmed && (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition flex items-center"
                  >
                    <Check size={16} className="mr-2" />
                    Confirmar Pedido
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <h3 className="font-medium text-green-400">Resumo do Pedido</h3>
            </div>
            
            <div className="p-4">
              <ul className="divide-y divide-gray-700">
                {items.map(item => (
                  <li key={item.product.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-400">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span className="text-green-400">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;