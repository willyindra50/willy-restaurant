'use client';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import ReviewModal, { type Review } from '@/components/ReviewModal';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
};

export default function MyOrder() {
  const { orders, loadOrders } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<null | {
    restaurantName: string;
  }>(null);

  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => console.log('🧾 Orders from BE:', orders), [orders]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  return (
    <div className='pt-20 flex min-h-screen px-4 gap-8'>
      {/* Sidebar */}
      <aside className='hidden md:block w-64 bg-white rounded-2xl shadow p-6 h-fit'>
        {user && (
          <div className='flex flex-col items-center text-center mb-6'>
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random`
              }
              alt={user.name}
              className='w-16 h-16 rounded-full mb-3'
            />
            <h3 className='font-semibold'>{user.name}</h3>
            <p className='text-sm text-gray-500'>{user.email}</p>
          </div>
        )}

        <ul className='space-y-3 text-sm'>
          <li className='cursor-pointer hover:text-orange-500'>
            Delivery Address
          </li>
          <li className='cursor-pointer hover:text-orange-500 font-semibold'>
            My Orders
          </li>
          <li
            className='cursor-pointer hover:text-orange-500'
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Orders */}
      <div className='flex-1'>
        <h2 className='text-xl font-bold mb-6'>My Orders</h2>

        {orders.length === 0 ? (
          <p className='text-gray-500'>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.transactionId}
              className='bg-white rounded-2xl shadow p-4 mb-6'
            >
              <div className='flex justify-between items-center mb-3'>
                <div className='font-semibold'>{order.restoName}</div>
              </div>

              {order.items.map((item) => (
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
                        {item.quantity} x Rp{item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className='flex items-center justify-between border-t pt-3 mt-3'>
                <p className='font-semibold'>
                  Total Rp{order.total.toLocaleString('id-ID')}
                </p>
                <button
                  className='bg-red-500 text-white px-6 py-2 rounded-full'
                  onClick={() =>
                    setSelectedOrder({ restaurantName: order.restoName })
                  }
                >
                  Give Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedOrder && user && (
        <ReviewModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          restaurantName={selectedOrder.restaurantName}
          currentUserName={user.name}
          currentUserAvatar={user.avatarUrl}
          onAddReview={(r) => setLocalReviews((prev) => [r, ...prev])}
        />
      )}

      {/* Local reviews (bypassed) */}
      {localReviews.length > 0 && (
        <div className='fixed bottom-4 right-4 max-w-sm w-full space-y-2'>
          {localReviews.map((r, i) => (
            <div key={i} className='p-2 bg-white rounded shadow'>
              <p className='font-medium'>{r.userName}</p>
              <p className='text-yellow-400'>{'★'.repeat(r.star)}</p>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
