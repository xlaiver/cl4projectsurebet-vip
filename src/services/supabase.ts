import { createClient } from '@supabase/supabase-js';
import { Customer } from '../App';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create a fallback mock client for development without Supabase credentials
const mockSupabaseClient = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // For demo purposes, accept any login with admin@example.com
      if (email === 'admin@example.com' && password === 'password') {
        return {
          data: { user: { id: '1', email } },
          error: null
        };
      }
      return {
        data: null,
        error: { message: 'Invalid login credentials' }
      };
    },
    signOut: async () => ({ error: null }),
    getUser: async () => ({
      data: { user: localStorage.getItem('isAuthenticated') === 'true' ? { id: '1', email: 'admin@example.com' } : null }
    })
  },
  from: (table: string) => ({
    insert: async (data: any) => {
      // Store in localStorage for demo
      const existingData = JSON.parse(localStorage.getItem(table) || '[]');
      existingData.push(data);
      localStorage.setItem(table, JSON.stringify(existingData));
      return { data, error: null };
    },
    select: () => ({
      order: () => {
        // Retrieve from localStorage for demo
        const data = JSON.parse(localStorage.getItem('customers') || '[]');
        return { data, error: null };
      }
    })
  })
};

// Use real Supabase client if configured, otherwise use mock client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabaseClient as any;

// Admin authentication
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Only set localStorage in mock mode
  if (!isSupabaseConfigured) {
    localStorage.setItem('isAuthenticated', 'true');
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  // Only clear localStorage in mock mode
  if (!isSupabaseConfigured) {
    localStorage.removeItem('isAuthenticated');
  }
  
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Customer data management
export async function saveCustomer(customer: Customer) {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    console.log('Saving customer to Supabase:', customer);
    
    const { data, error } = await supabase
      .from('customers')
      .insert({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        purchase_date: customer.purchaseDate,
        total: customer.total,
        payment_method: customer.paymentMethod,
        items: JSON.stringify(customer.items),
        user_id: userId || null
      });
    
    if (error) {
      console.error('Error saving customer to Supabase:', error);
      throw error;
    }
    
    console.log('Customer saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveCustomer function:', error);
    throw error;
  }
}

export async function getCustomers() {
  try {
    console.log('Fetching customers from Supabase');
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('purchase_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching customers from Supabase:', error);
      throw error;
    }
    
    console.log('Customers fetched successfully:', data);
    
    // Transform the data to match our Customer type
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      purchaseDate: item.purchase_date,
      total: item.total,
      paymentMethod: item.payment_method,
      items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items
    }));
  } catch (error) {
    console.error('Error in getCustomers function:', error);
    throw error;
  }
}