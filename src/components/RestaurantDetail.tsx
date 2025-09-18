import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import ReviewSection from './Review';
import { useCart } from '@/context/CartContext';

interface Menu {
  id: number;
  foodName: string;
  price: number;
  type: 'food' | 'drink';
  image: string;
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const [filter, setFilter] = useState<'all' | 'food' | 'drink'>('all');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [restoName, setRestoName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, increase, decrease } = useCart();

  const tabs = [
    { label: 'All Menu', value: 'all' },
    { label: 'Food', value: 'food' },
    { label: 'Drink', value: 'drink' },
  ] as const;

  useEffect(() => {
    if (!id) return;
    fetch(
      `https://foody-api-xi.vercel.app/api/resto/${id}?limitMenu=10&limitReview=6`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.menus) {
            setMenus(data.data.menus);
          }
          if (data.data.name) {
            setRestoName(data.data.name);
          }
        }
      })
      .catch((err) => console.error('Error fetching menu:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const filteredMenus =
    filter === 'all' ? menus : menus.filter((m) => m.type === filter);

  // fungsi fallback image
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/menu/beef-burger.png';
  };

  return (
    <div className='pt-20'>
      <div className='max-w-[1200px] mx-auto px-4 sm:px-8'>
        {/* 🔹 Cover Images */}
        <div className='hidden md:grid grid-cols-2 gap-2'>
          {/* Kiri besar */}
          <img
            src='/cover.png'
            alt='cover'
            className='w-full h-[470px] object-cover rounded-2xl'
          />
          {/* Kanan */}
          <div className='grid grid-rows-2 gap-2'>
            <img
              src='/cover-2.png'
              alt='cover2'
              className='w-full h-[302px] object-cover rounded-2xl'
            />
            <div className='grid grid-cols-2 gap-2'>
              <img
                src='/cover-3.png'
                alt='cover3'
                className='w-full h-[148px] object-cover rounded-2xl'
              />
              <img
                src='/cover-4.png'
                alt='cover4'
                className='w-full h-[148px] object-cover rounded-2xl'
              />
            </div>
          </div>
        </div>

        {/* Mobile: slider horizontal */}
        <div className='md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory mt-2'>
          {['/cover.png', '/cover-2.png', '/cover-3.png', '/cover-4.png'].map(
            (src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`cover-${idx}`}
                className='w-full h-56 object-cover rounded-2xl flex-shrink-0 snap-center'
              />
            )
          )}
        </div>

        {/* Info Resto */}
        <div className='flex items-center gap-4 mt-6'>
          <img src='/burger-king.png' className='w-16 h-16 rounded-full' />
          <div>
            <h2 className='text-xl font-semibold'>
              {restoName || `Restaurant ${id}`}
            </h2>
            <div className='flex items-center text-sm text-gray-600 gap-2'>
              <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />⭐
              Reviews info dinamis bisa ditambah nanti
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className='mt-10'>
          <h3 className='text-lg font-semibold mb-4'>Menu</h3>
          <div className='flex gap-3 mb-4'>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 rounded-full border ${
                  filter === tab.value
                    ? 'bg-red-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && <p>Loading menu...</p>}

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {filteredMenus.map((menu) => {
              const itemInCart = cart.find((c) => c.id === menu.id);

              return (
                <div
                  key={menu.id}
                  className='border rounded-2xl shadow-sm overflow-hidden flex flex-col'
                >
                  {/* 🔹 fallback image pakai onError */}
                  <img
                    src={menu.image || '/menu/beef-burger.png'}
                    alt={menu.foodName}
                    className='w-full h-full object-cover'
                    onError={handleImageError}
                  />
                  <div className='flex flex-col justify-between flex-1 p-3'>
                    <div>
                      <h4 className='font-medium text-gray-800 text-sm'>
                        {menu.foodName}
                      </h4>
                      <p className='text-sm text-gray-600 font-semibold'>
                        Rp{menu.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {itemInCart ? (
                      <div className='flex items-center gap-2 self-end'>
                        <button
                          onClick={() => decrease(menu.id)}
                          className='w-7 h-7 rounded-full border flex items-center justify-center'
                        >
                          –
                        </button>
                        <span>{itemInCart.quantity}</span>
                        <button
                          onClick={() => increase(menu.id)}
                          className='w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center'
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart({
                            id: menu.id,
                            foodName: menu.foodName,
                            price: menu.price,
                            image: menu.image || '/menu/beef-burger.png',
                            restoName: restoName || `Restaurant ${id}`,
                            restaurantId: Number(id),
                          })
                        }
                        className='bg-red-500 text-white px-6 py-2 rounded-full self-end'
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ReviewSection />
      <div className='max-w-[1200px] mx-auto'>
        <Footer />
      </div>
    </div>
  );
}
