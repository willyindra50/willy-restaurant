'use client';

import { useCart } from '@/context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  restoName: string;
  foodName: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckOut() {
  const { cart, increase, decrease, checkout } = useCart();
  const [payment, setPayment] = useState<string>('bni');
  const navigate = useNavigate();

  // Group items by resto
  const grouped = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.restoName]) acc[item.restoName] = [];
    acc[item.restoName].push(item);
    return acc;
  }, {});

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const deliveryFee = 10000;
  const serviceFee = 1000;

  const handleBuy = () => {
    if (cart.length === 0) return;
    checkout(); // pindahin cart → orders
    navigate('/payment-success'); // arahkan ke PaymentSuccess
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <main className='flex-1 pt-24 px-4 flex flex-col items-center'>
        <div className='w-full max-w-[1000px] flex flex-col md:flex-row gap-6'>
          {/* Left Side */}
          <div className='flex-1 flex flex-col gap-6'>
            {/* Delivery Address */}
            <div className='bg-white shadow rounded-2xl p-4 md:w-[590px]'>
              <h3 className='font-semibold mb-2 flex items-center gap-2'>
                <span className='text-orange-500'>📍</span> Delivery Address
              </h3>
              <p>Jl. Sudirman No. 25, Jakarta Pusat, 10220</p>
              <p>0812-3456-7890</p>
              <button className='mt-3 px-4 py-2 border rounded-full'>
                Change
              </button>
            </div>

            {/* Items */}
            {Object.entries(grouped).map(([resto, items]) => (
              <div
                key={resto}
                className='bg-white shadow rounded-2xl p-4 md:w-[590px]'
              >
                <div className='flex justify-between items-center mb-3'>
                  <h3 className='font-semibold flex items-center gap-2'>
                    🍔 {resto}
                  </h3>
                  <button className='text-sm border px-3 py-1 rounded-full'>
                    Add Item
                  </button>
                </div>

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
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className='flex flex-col gap-6 md:w-[390px] w-full'>
            {/* Payment Method */}
            <div className='bg-white shadow rounded-2xl p-4'>
              <h3 className='font-semibold mb-3'>Payment Method</h3>
              <div className='space-y-3'>
                {[
                  {
                    id: 'bni',
                    name: 'Bank Negara Indonesia',
                    logo: '/bni.png',
                  },
                  {
                    id: 'bri',
                    name: 'Bank Rakyat Indonesia',
                    logo: '/bri.png',
                  },
                  { id: 'bca', name: 'Bank Central Asia', logo: '/bca.png' },
                  { id: 'mandiri', name: 'Mandiri', logo: '/mandiri.png' },
                ].map((bank) => (
                  <label
                    key={bank.id}
                    className='flex items-center justify-between cursor-pointer'
                  >
                    <div className='flex items-center gap-3'>
                      <img src={bank.logo} alt={bank.name} className='w-10' />
                      <span>{bank.name}</span>
                    </div>
                    <input
                      type='radio'
                      name='payment'
                      value={bank.id}
                      checked={payment === bank.id}
                      onChange={() => setPayment(bank.id)}
                      className='appearance-none w-4 h-4 border border-gray-400 rounded-full checked:border-red-500 checked:bg-red-500 cursor-pointer'
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className='bg-white shadow rounded-2xl p-4'>
              <h3 className='font-semibold mb-3'>Payment Summary</h3>
              <div className='flex justify-between mb-2'>
                <span>Price ({cart.length} Items)</span>
                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Delivery Fee</span>
                <span>Rp{deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Service Fee</span>
                <span>Rp{serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className='flex justify-between font-semibold mt-3'>
                <span>Total</span>
                <span>
                  Rp
                  {(totalPrice + deliveryFee + serviceFee).toLocaleString(
                    'id-ID'
                  )}
                </span>
              </div>
              <button
                onClick={handleBuy}
                className='w-full mt-4 bg-red-500 text-white py-2 rounded-full'
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
