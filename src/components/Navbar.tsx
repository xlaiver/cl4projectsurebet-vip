import React from 'react';
import { ShoppingCart, Home, TrendingUp, Lock } from 'lucide-react';

type NavbarProps = {
  cartItemCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
  onAdminClick: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ cartItemCount, onCartClick, onHomeClick, onAdminClick }) => {
  return (
    <header className="bg-gray-800 text-white shadow-md border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onHomeClick}>
            <TrendingUp size={24} className="text-green-400" />
            <h1 className="text-xl font-bold">Vivendo de Surebet</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button 
                  onClick={onHomeClick}
                  className="flex items-center space-x-1 hover:text-green-400 transition"
                >
                  <Home size={20} />
                  <span>Início</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onCartClick}
                  className="flex items-center space-x-1 hover:text-green-400 transition relative"
                >
                  <ShoppingCart size={20} />
                  <span>Carrinho</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button 
                  onClick={onAdminClick}
                  className="flex items-center space-x-1 hover:text-green-400 transition"
                >
                  <Lock size={20} />
                  <span>Admin</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;