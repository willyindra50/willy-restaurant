'use client';

import { useCart } from '@/context/CartContext';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

// sesuaikan dengan CartContext (id harus number)
interface CartItem {
  id: number;
  restoName: string;
  foodName: string;
  price: number;
  quantity: number;
  image: string;
}

export default function MyCart() {
  const { cart, increase, decrease } = useCart();
  const navigate = useNavigate();

  // group items per resto
  const grouped = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.restoName]) acc[item.restoName] = [];
    acc[item.restoName].push(item as CartItem);
    return acc;
  }, {});

  return (
    <div className='pt-20 flex flex-col min-h-screen'>
      <div className='flex-1 flex flex-col items-center px-4'>
        <div className='w-full max-w-[800px]'>
          <h2 className='text-xl font-bold mb-6'>My Cart</h2>

          {Object.entries(grouped).map(([resto, items]) => {
            const total = items.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            );
            return (
              <div key={resto} className='bg-white rounded-2xl shadow p-4 mb-6'>
                <div className='font-semibold mb-3'>{resto} →</div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between mb-3'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        src={item.image}
                        alt={item.foodName}
                        className='w-14 h-14 rounded-md object-cover'
                      />
                      <div>
                        <p className='font-medium'>{item.foodName}</p>
                        <p className='text-sm text-gray-600'>
                          Rp{item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => decrease(item.id)}
                        className='w-7 h-7 border rounded-full flex items-center justify-center'
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increase(item.id)}
                        className='w-7 h-7 border rounded-full flex items-center justify-center bg-red-500 text-white'
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className='flex items-center justify-between border-t pt-3 mt-3'>
                  <p className='font-semibold'>
                    Total Rp{total.toLocaleString('id-ID')}
                  </p>
                  <button
                    onClick={() => navigate('/checkout')}
                    className='bg-red-500 text-white px-6 py-2 rounded-full'
                  >
                    Checkout
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
