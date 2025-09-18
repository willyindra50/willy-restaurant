'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Restaurant = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  reviewCount: number;
};

export default function Hero() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://foody-api-xi.vercel.app/api/resto?limit=40`
        );
        const data = await res.json();
        setRestaurants(data.data.restaurants);
      } catch {
        // ignore error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter restaurant sesuai search
  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      {/* Hero */}
      <div
        className='relative h-[500px] md:h-[600px] flex items-center justify-center'
        style={{
          backgroundImage: "url('/hero-burger.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/50' />
        <div className='relative text-center text-white z-10 max-w-2xl px-4'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4 leading-snug'>
            Explore Culinary Experiences
          </h1>
          <p className='mb-6 text-base md:text-lg'>
            Search and refine your choice to discover the perfect restaurant.
          </p>
          <div className='flex justify-center'>
            <Input
              type='text'
              placeholder='Search restaurants, food and drink'
              className='w-full max-w-xl rounded-full px-6 py-4 md:py-5 text-black bg-neutral-300 placeholder:text-gray-600'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Search Result */}
      {search.trim() !== '' && (
        <section className='py-10 bg-white'>
          <div className='mx-auto w-full max-w-[1200px] px-4'>
            {loading ? (
              <p className='text-center text-gray-500'>Loading...</p>
            ) : filteredRestaurants.length === 0 ? (
              <p className='text-center text-gray-500'>No restaurants found.</p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {filteredRestaurants.map((item) => {
                  const fallback = '/burger-king.png';
                  const imgSrc =
                    (item.images && item.images.length > 0 && item.images[0]) ||
                    item.logo ||
                    fallback;

                  return (
                    <Card
                      key={item.id}
                      className='w-full md:w-[370px] h-[152px] flex items-center gap-4 p-4 hover:shadow-md cursor-pointer'
                      onClick={() => navigate(`/restaurant/${item.id}`)}
                    >
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className='w-28 h-28 object-cover rounded-lg flex-shrink-0'
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = fallback)
                        }
                      />
                      <div className='flex flex-col justify-center flex-1'>
                        <h3 className='font-semibold text-base'>{item.name}</h3>
                        <div className='flex items-center gap-1 text-sm text-gray-600 mt-1'>
                          <Star
                            size={14}
                            className='text-yellow-400 fill-yellow-400'
                          />
                          {item.star}
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                          {item.place} • {item.reviewCount} reviews
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
