'use client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import Footer from './Footer';

interface Resto {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  reviewCount: number;
}

export default function AllRestaurant() {
  const [restos, setRestos] = useState<Resto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://foody-api-xi.vercel.app/api/resto?page=1&limit=40')
      .then((res) => res.json())
      .then((data) => {
        setRestos(data.data.restaurants);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching restos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className='pt-24'>
      <div className='w-full max-w-[1200px] mx-auto px-4'>
        {/* Judul */}
        <h2 className='text-2xl font-bold mb-6'>All Restaurant</h2>

        {/* Layout konten */}
        <div className='flex gap-8'>
          {/* Sidebar Filter (desktop) */}
          <aside className='hidden md:block w-[250px] shrink-0'>
            <FilterBox />
          </aside>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Tombol filter mobile */}
            <div className='flex justify-end mb-4 md:hidden'>
              <button
                onClick={() => setShowFilter(true)}
                className='flex items-center gap-2 border px-3 py-1 rounded-lg'
              >
                <Filter size={20} />
                Filter
              </button>
            </div>

            {/* Grid resto */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {restos.map((r) => {
                  const fallback = '/burger-king.png';
                  const imgSrc =
                    (r.images && r.images.length > 0 && r.images[0]) ||
                    r.logo ||
                    fallback;

                  return (
                    <div
                      key={r.id}
                      onClick={() => navigate(`/restaurant/${r.id}`)}
                      className='flex items-center gap-4 w-[437px] h-[152px] bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg transition'
                    >
                      <img
                        src={imgSrc}
                        alt={r.name}
                        className='w-[120px] h-[120px] object-cover rounded-lg'
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallback;
                        }}
                      />
                      <div className='flex-1'>
                        <h3 className='font-semibold text-lg'>{r.name}</h3>
                        <p className='text-sm text-gray-600 flex items-center gap-1'>
                          ⭐ {r.star}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {r.place} • {r.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer filter mobile */}
      {showFilter && (
        <div className='fixed inset-0 bg-black/50 z-50'>
          <div className='absolute top-0 left-0 w-[280px] h-full bg-white p-6 shadow-lg animate-slide-in'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='font-semibold'>FILTER</h3>
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>
            <FilterBox />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FilterBox() {
  return (
    <div className='space-y-6 text-sm'>
      <div>
        <h4 className='font-semibold mb-2'>Distance</h4>
        <div className='flex flex-col gap-2'>
          <label>
            <input type='checkbox' defaultChecked /> Nearby
          </label>
          <label>
            <input type='checkbox' /> Within 1 km
          </label>
          <label>
            <input type='checkbox' /> Within 3 km
          </label>
          <label>
            <input type='checkbox' /> Within 5 km
          </label>
        </div>
      </div>

      <div>
        <h4 className='font-semibold mb-2'>Price</h4>
        <input
          placeholder='Minimum Price'
          className='w-full border rounded px-2 py-1 mb-2'
        />
        <input
          placeholder='Maximum Price'
          className='w-full border rounded px-2 py-1'
        />
      </div>

      <div>
        <h4 className='font-semibold mb-2'>Rating</h4>
        <div className='flex flex-col gap-2'>
          {[5, 4, 3, 2, 1].map((r) => (
            <label key={r}>
              <input type='checkbox' /> ⭐ {r}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
