import { CartItem } from '../App';

// MercadoPago API interface
interface MercadoPagoPreference {
  items: Array<{
    title: string;
    unit_price: number;
    quantity: number;
    currency_id: string;
  }>;
  payer: {
    email: string;
    name?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference?: string;
}

export async function createMercadoPagoPreference(
  items: CartItem[],
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  }
) {
  try {
    // Format items for MercadoPago
    const mpItems = items.map(item => ({
      title: item.product.name,
      unit_price: item.product.price,
      quantity: item.quantity,
      currency_id: 'BRL'
    }));

    // Format phone number (remove non-numeric characters)
    const phoneNumber = customerInfo.phone.replace(/\D/g, '');
    const areaCode = phoneNumber.substring(0, 2);
    const number = phoneNumber.substring(2);

    // Create preference object
    const preference: MercadoPagoPreference = {
      items: mpItems,
      payer: {
        email: customerInfo.email,
        name: customerInfo.name,
        phone: {
          area_code: areaCode,
          number: number
        }
      },
      back_urls: {
        success: window.location.origin + '/success',
        failure: window.location.origin + '/failure',
        pending: window.location.origin + '/pending'
      },
      auto_return: 'approved',
      external_reference: `ORDER_${Date.now()}`
    };

    // Call your backend API to create the preference
    // In a real implementation, you would have a backend endpoint to handle this
    // For this example, we'll simulate a successful response
    
    // This would be a real API call in production:
    // const response = await fetch('/api/create-preference', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(preference)
    // });
    // const data = await response.json();
    // return data.id;

    // For demonstration purposes, we'll return a simulated preference ID
    // In a real implementation, this would come from your backend
    return `SIMULATED_PREFERENCE_${Date.now()}`;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw error;
  }
}

export function loadMercadoPagoScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).MercadoPago) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MercadoPago SDK'));
    document.body.appendChild(script);
  });
}

export function initMercadoPago() {
  const mp = new (window as any).MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
    locale: 'pt-BR'
  });
  return mp;
}