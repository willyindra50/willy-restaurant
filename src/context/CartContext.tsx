// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: number;
  foodName: string;
  price: number;
  image: string;
  restoName: string;
  restaurantId: number;
  quantity: number;
}

export interface Order {
  id: number;
  transactionId: string;
  restaurantId: number;
  restoName: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  checkout: () => void;
  loadOrders: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // 🔹 Load cart & orders saat mount
  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    if (localCart) setCart(JSON.parse(localCart));

    const localOrders = localStorage.getItem('orders');
    if (localOrders) setOrders(JSON.parse(localOrders));

    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        // ✅ cuma overwrite kalau data API ada isi
        if (Array.isArray(data) && data.length > 0) {
          setCart(data);
          localStorage.setItem('cart', JSON.stringify(data));
        } else {
          console.log('ℹ️ API cart kosong → pakai localStorage');
        }
      } catch (err) {
        console.warn(
          '⚠️ Gagal fetch cart dari API, tetap pakai localStorage:',
          err
        );
      }
    };

    fetchCart();
  }, []);

  // 🔹 Sync cart ke localStorage setiap berubah
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // --- Actions ---
  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...item, quantity: 1 }),
      });
    } catch {
      console.warn('⚠️ Gagal sync addToCart ke API');
    }
  };

  const increase = async (id: number) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/cart/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: 'increase' }),
      });
    } catch {
      console.warn('⚠️ Gagal sync increase ke API');
    }
  };

  const decrease = async (id: number) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/cart/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: 'decrease' }),
      });
    } catch {
      console.warn('⚠️ Gagal sync decrease ke API');
    }
  };

  // ✅ Checkout → simpan order baru + clear cart
  const checkout = async () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: Date.now(),
      transactionId: `TXN${Date.now()}`,
      restaurantId: cart[0].restaurantId,
      restoName: cart[0].restoName,
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newOrder),
      });
    } catch {
      console.warn('⚠️ Gagal sync checkout ke API');
    }

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // ❌ jangan hapus key "cart", cukup kosongkan array
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const loadOrders = () => {
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(localOrders);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        increase,
        decrease,
        checkout,
        loadOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
