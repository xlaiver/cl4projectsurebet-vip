import React from 'react';
import { ShoppingCart, Clock, Calendar, Award } from 'lucide-react';
import { Product } from '../App';

// Updated product data for Surebet subscriptions with new prices
const products: Product[] = [
  {
    id: 1,
    name: 'Vivendo de Surebet VIP - Semanal',
    price: 69.90,
    image: 'https://media.istockphoto.com/id/178786888/pt/foto/nova-unidade-monet%C3%A1ria-brasileira.jpg?s=612x612&w=0&k=20&c=qmkWAlPvs76jXYzCjbH-syVuvdex8W2YyfTCxw7WeUg=',
    description: 'Acesso VIP por 7 dias a todas as nossas surebets e estratégias exclusivas.',
    pixCode: '00020126360014br.gov.bcb.pix0114+5531933061733520400005303986540569.905802BR5918JOHNNY REIS SANTOS6006Brasil62290525202503032205HIODLPSWPXNRH63040125'
  },
  {
    id: 2,
    name: 'Vivendo de Surebet VIP - Mensal',
    price: 159.90,
    image: 'https://media.istockphoto.com/id/178786888/pt/foto/nova-unidade-monet%C3%A1ria-brasileira.jpg?s=612x612&w=0&k=20&c=qmkWAlPvs76jXYzCjbH-syVuvdex8W2YyfTCxw7WeUg=',
    description: 'Acesso VIP por 30 dias com suporte prioritário e todas as surebets identificadas.',
    pixCode: '00020126360014br.gov.bcb.pix0114+55319330617335204000053039865406159.905802BR5918JOHNNY REIS SANTOS6006Brasil62290525202503032205MBC8WFPN9SXM16304EC88'
  },
  {
    id: 3,
    name: 'Vivendo de Surebet VIP - Trimestral',
    price: 299.90,
    image: 'https://media.istockphoto.com/id/178786888/pt/foto/nova-unidade-monet%C3%A1ria-brasileira.jpg?s=612x612&w=0&k=20&c=qmkWAlPvs76jXYzCjbH-syVuvdex8W2YyfTCxw7WeUg=',
    description: 'Acesso VIP por 90 dias com todas as vantagens e consultorias exclusivas.',
    pixCode: '00020126360014br.gov.bcb.pix0114+55319330617335204000053039865406299.905802BR5918JOHNNY REIS SANTOS6006Brasil62290525202503032206AL9E3U49TSJ0C630464CE'
  }
];

type ProductListProps = {
  onAddToCart: (product: Product) => void;
};

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const getIcon = (id: number) => {
    switch(id) {
      case 1: return <Clock className="text-green-400" />;
      case 2: return <Calendar className="text-green-400" />;
      case 3: return <Award className="text-green-400" />;
      default: return <Clock className="text-green-400" />;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-400">Nossos Planos VIP</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-700">
            <div className="h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-3">
                {getIcon(product.id)}
                <h3 className="text-lg font-semibold ml-2">{product.name}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-400">
                  R$ {product.price.toFixed(2)}
                </span>
                
                <button 
                  onClick={() => onAddToCart(product)}
                  className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center space-x-1 hover:bg-green-700 transition"
                >
                  <ShoppingCart size={16} />
                  <span>Assinar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
