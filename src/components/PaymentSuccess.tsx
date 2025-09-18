'use client';

import { useNavigate } from 'react-router-dom';
import foodyRed from '/foody-red.png';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-sm bg-white rounded-2xl shadow p-6 text-center'>
        <div className='flex items-center justify-center mb-4'>
          <img src={foodyRed} alt='Foody' className='h-6 mr-2' />
        </div>

        <div className='flex flex-col items-center'>
          <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3'>
            <span className='text-green-600 text-2xl'>✓</span>
          </div>
          <h2 className='text-lg font-semibold'>Payment Success</h2>
          <p className='text-gray-500 text-sm mb-6'>
            Your payment has been successfully processed.
          </p>

          <div className='border-t pt-4 text-sm text-left w-full'>
            <div className='flex justify-between mb-1'>
              <span>Date</span>
              <span>25 August 2025, 15:51</span>
            </div>
            <div className='flex justify-between mb-1'>
              <span>Payment Method</span>
              <span>Bank Rakyat Indonesia</span>
            </div>
            <div className='flex justify-between mb-1'>
              <span>Price (2 items)</span>
              <span>Rp100.000</span>
            </div>
            <div className='flex justify-between mb-1'>
              <span>Delivery Fee</span>
              <span>Rp10.000</span>
            </div>
            <div className='flex justify-between mb-1'>
              <span>Service Fee</span>
              <span>Rp1.000</span>
            </div>
            <div className='flex justify-between font-semibold mt-2'>
              <span>Total</span>
              <span>Rp111.000</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/my-order')}
            className='w-full bg-red-500 text-white py-2 rounded-full mt-6'
          >
            See My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
