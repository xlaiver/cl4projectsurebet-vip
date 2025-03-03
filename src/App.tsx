import React, { useState, useEffect } from 'react';
import { ShoppingCart, Home, Package, CreditCard, Check } from 'lucide-react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { saveCustomer, getCurrentUser } from './services/supabase';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  pixCode?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  purchaseDate: string;
  total: number;
  items: CartItem[];
  paymentMethod?: string;
};

function App() {
  const [view, setView] = useState<
    'products' | 'cart' | 'checkout' | 'confirmation' | 'admin' | 'login'
  >('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<{
    items: CartItem[];
    total: number;
    customerInfo: any;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Check if Supabase is configured
  const isSupabaseConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    // Automatically navigate to cart when adding a product
    setView('cart');
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const completeCheckout = async (customerInfo: any) => {
    try {
      const newOrder = {
        items: [...cart],
        total: calculateTotal(),
        customerInfo,
      };

      setOrder(newOrder);

      // Add customer to the database
      const newCustomer: Customer = {
        id: Math.random().toString(36).substring(2, 9),
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        purchaseDate: new Date().toISOString(),
        total: calculateTotal(),
        items: [...cart],
        paymentMethod: 'pix',
      };

      console.log('Saving customer data:', newCustomer);
      
      // Save customer to Supabase
      await saveCustomer(newCustomer);
      console.log('Customer data saved successfully');
      
      setCart([]);
      setView('confirmation');
    } catch (error) {
      console.error('Error completing checkout:', error);
      alert('Ocorreu um erro ao finalizar a compra. Por favor, tente novamente.');
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('products');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar
        cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)}
        onCartClick={() => setView('cart')}
        onHomeClick={() => setView('products')}
        onAdminClick={handleAdminClick}
      />

      {!isSupabaseConfigured && view === 'products' && (
        <div className="bg-yellow-900/30 border-b border-yellow-800 py-2">
          <div className="container mx-auto px-4">
            <p className="text-yellow-300 text-sm text-center">
              Modo de demonstração ativo. Para persistência real de dados, conecte-se ao Supabase clicando no botão "Connect to Supabase" no canto superior direito.
            </p>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'products' && <ProductList onAddToCart={addToCart} />}

        {view === 'cart' && (
          <Cart
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setView('checkout')}
            onContinueShopping={() => setView('products')}
            total={calculateTotal()}
          />
        )}

        {view === 'checkout' && (
          <Checkout
            items={cart}
            total={calculateTotal()}
            onCompleteCheckout={completeCheckout}
            onBackToCart={() => setView('cart')}
          />
        )}

        {view === 'confirmation' && order && (
          <OrderConfirmation
            order={order}
            onContinueShopping={() => setView('products')}
          />
        )}

        {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}

        {view === 'admin' && isAuthenticated && (
          <AdminPanel onLogout={handleLogout} />
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-3 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <p className="text-center">
            © 2025 Vivendo de Surebet. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;