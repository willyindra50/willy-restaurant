import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Restaurant = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  reviewCount: number;
};

interface RecommendedProps {
  searchKeyword?: string;
}

export default function Recommended({ searchKeyword = '' }: RecommendedProps) {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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
        // hilangkan unused err
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter sesuai search keyword
  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const isMobile = window.innerWidth < 768;
  const visibleItems = showAll
    ? filtered
    : isMobile
    ? filtered.slice(0, 4)
    : filtered.slice(0, 12);

  return (
    <section className='py-10 bg-white'>
      <div className='mx-auto w-full max-w-[1200px] px-4'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>Recommended</h2>
          <button
            className='text-red-500 text-sm font-medium'
            onClick={() => setShowAll(true)}
          >
            See All
          </button>
        </div>

        {loading && <p className='text-center text-gray-500'>Loading...</p>}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {!loading &&
            visibleItems.map((item) => {
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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallback;
                    }}
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

        <div className='flex justify-center mt-10'>
          {!showAll && filtered.length > 0 && (
            <button
              className='px-6 py-2 border rounded-full text-sm hover:bg-gray-100'
              onClick={() => setShowAll(true)}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
