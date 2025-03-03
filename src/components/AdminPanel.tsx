import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  LogOut,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { Customer } from '../App';
import { getCustomers, signOut } from '../services/supabase';

type AdminPanelProps = {
  onLogout: () => void;
  initialCustomers?: Customer[];
};

const AdminPanel: React.FC<AdminPanelProps> = ({
  onLogout,
  initialCustomers = [],
}) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if Supabase is configured
  const isSupabaseConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        console.log('Loading customers from Supabase...');
        const data = await getCustomers();
        console.log('Customers loaded:', data);
        setCustomers(data);
      } catch (err: any) {
        console.error('Error loading customers:', err);
        setError(err.message || 'Erro ao carregar dados dos clientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Data da Compra',
      'Método de Pagamento',
      'Total',
      'Itens',
    ];

    const csvData = filteredCustomers.map((customer) => {
      const items = customer.items
        .map((item) => `${item.product.name} (${item.quantity})`)
        .join('; ');

      return [
        customer.name,
        customer.email,
        customer.phone,
        formatDate(customer.purchaseDate),
        'PIX',
        `R$ ${customer.total.toFixed(2)}`,
        items,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `clientes_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-3 text-xl text-gray-300">Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-800 text-white p-6 rounded-md">
        <h3 className="text-xl font-bold mb-2">Erro ao carregar dados</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-700 px-4 py-2 rounded-md hover:bg-red-800 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">
          Painel Administrativo
        </h2>

        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 text-white w-64"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center"
          >
            <Download size={18} className="mr-2" />
            Exportar CSV
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition flex items-center"
          >
            <LogOut size={18} className="mr-2" />
            Sair
          </button>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-md p-4 mb-6 flex items-center">
          <AlertTriangle size={20} className="text-yellow-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-yellow-300">
              Modo de demonstração ativo. Os dados são armazenados localmente e serão perdidos ao recarregar a página.
            </p>
            <p className="text-yellow-400 text-sm mt-1">
              Para persistência real de dados, conecte-se ao Supabase clicando no botão "Connect to Supabase" no canto superior direito.
            </p>
          </div>
        </div>
      )}
      
      {isSupabaseConfigured && (
        <div className="bg-green-900/30 border border-green-800 rounded-md p-4 mb-6 flex items-center">
          <Database size={20} className="text-green-500 mr-2 flex-shrink-0" />
          <p className="text-green-300">
            Conectado ao Supabase. Os dados dos clientes são armazenados de forma segura e persistente.
          </p>
        </div>
      )}

      {customers.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-700">
          <User size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">
            Nenhum cliente registrado
          </h3>
          <p className="text-gray-400">
            Os dados dos clientes aparecerão aqui após as compras.
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Contato</th>
                  <th className="text-left p-4">Data da Compra</th>
                  <th className="text-left p-4">Pagamento</th>
                  <th className="text-right p-4">Total</th>
                  <th className="text-left p-4">Planos Adquiridos</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-gray-700 hover:bg-gray-750"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <User size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300">{customer.email}</p>
                      <p className="text-sm text-gray-400">{customer.phone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span>{formatDate(customer.purchaseDate)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <CreditCard size={16} className="text-gray-400 mr-2" />
                        <span>PIX</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <DollarSign size={16} className="text-green-400 mr-1" />
                        <span className="font-medium">
                          R$ {customer.total.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <ul className="list-disc list-inside text-sm">
                        {customer.items.map((item, index) => (
                          <li key={index} className="text-gray-300">
                            {item.product.name}{' '}
                            <span className="text-gray-400">
                              x{item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center">
              <Search size={32} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">
                Nenhum resultado encontrado para "{searchTerm}"
              </p>
            </div>
          )}

          <div className="bg-gray-700 p-4 text-sm text-gray-400">
            Mostrando {filteredCustomers.length} de {customers.length} clientes
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;