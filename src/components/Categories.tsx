import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, icon: '/categories/all-restaurant.png', label: 'All Restaurant' },
  { id: 2, icon: '/categories/nearby.png', label: 'Nearby' },
  { id: 3, icon: '/categories/discount.png', label: 'Discount' },
  { id: 4, icon: '/categories/best-seller.png', label: 'Best Seller' },
  { id: 5, icon: '/categories/delivery.png', label: 'Delivery' },
  { id: 6, icon: '/categories/lunch.png', label: 'Lunch' },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleClick = (label: string) => {
    if (label === 'All Restaurant') {
      navigate('/all-restaurant');
    }
    // nanti bisa tambahin else if untuk category lain
  };

  return (
    <section className='py-10 bg-white'>
      <div className='mx-auto w-full max-w-[1150px] grid grid-cols-3 md:flex md:justify-between md:gap-12'>
        {categories.map((c) => (
          <div
            key={c.id}
            className='flex flex-col items-center justify-center gap-5 cursor-pointer'
            onClick={() => handleClick(c.label)}
          >
            <div className='w-12 h-12'>
              <img
                src={c.icon}
                alt={c.label}
                className='w-full h-full object-contain'
              />
            </div>
            <p className='text-sm font-medium'>{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
