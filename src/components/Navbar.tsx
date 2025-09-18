import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className='max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-12 py-4'>
        {/* Logo */}
        <Link to='/' className='font-bold text-xl flex items-center gap-2'>
          <img
            src={scrolled ? '/foody-red.png' : '/foody-white.png'}
            alt='Foody'
            className='w-6 h-6'
          />
          <span
            className={`hidden md:inline ${
              scrolled ? 'text-black' : 'text-neutral-400'
            }`}
          >
            Foody
          </span>
        </Link>

        {/* Right side */}
        {user ? (
          <div className='flex items-center gap-3'>
            {/* Cart */}
            <div
              className='relative cursor-pointer'
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart
                size={22}
                className={scrolled ? 'text-black' : 'text-neutral-400'}
              />
              {cart.length > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2'>
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </div>

            {/* Avatar + Name */}
            <div
              className='relative flex items-center gap-2 cursor-pointer'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={
                  user.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random`
                }
                alt={user.name}
                className='w-8 h-8 rounded-full'
              />
              <span
                className={`hidden md:inline ${
                  scrolled ? 'text-black' : 'text-neutral-400'
                }`}
              >
                {user.name}
              </span>

              {menuOpen && (
                <div className='absolute top-12 right-0 bg-white text-black shadow-lg rounded-2xl w-48 p-3'>
                  <div
                    className='flex items-center gap-2 border-b pb-2 mb-2 cursor-pointer hover:text-orange-500'
                    onClick={() => navigate('/profile')}
                  >
                    <img
                      src={
                        user.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=random`
                      }
                      alt={user.name}
                      className='w-8 h-8 rounded-full'
                    />
                    <span className='font-medium'>{user.name}</span>
                  </div>
                  <ul className='space-y-2 text-sm'>
                    <li className='flex items-center gap-2 cursor-pointer hover:text-orange-500'>
                      <img
                        src='/address.png'
                        alt='address'
                        className='w-4 h-4'
                      />
                      Delivery Address
                    </li>
                    <li
                      className='flex items-center gap-2 cursor-pointer hover:text-orange-500'
                      onClick={() => navigate('/my-order')}
                    >
                      <img
                        src='/my-order.png'
                        alt='my order'
                        className='w-4 h-4'
                      />
                      My Orders
                    </li>
                    <li
                      onClick={handleLogout}
                      className='flex items-center gap-2 cursor-pointer hover:text-orange-500'
                    >
                      <img src='/logout.png' alt='logout' className='w-4 h-4' />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <Link to='/auth'>
              <Button
                className={`rounded-full px-6 border ${
                  scrolled
                    ? 'border-black text-black bg-transparent'
                    : 'border-white text-white bg-transparent'
                }`}
              >
                Sign In
              </Button>
            </Link>
            <Link to='/auth'>
              <Button className='bg-white text-black rounded-full px-6'>
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
