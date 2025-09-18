import { Facebook, Instagram, Linkedin, Music2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-black text-white py-12 px-8 mt-16'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10'>
        {/* Brand */}
        <div>
          <div className='flex items-center gap-2 text-lg font-bold mb-4'>
            <img
              src='/foody-red.png'
              alt='Foody'
              className='w-6 h-6 object-contain'
            />
            <span>Foody</span>
          </div>
          <p className='text-sm text-gray-400 mb-6'>
            Enjoy homemade flavors & chef’s signature dishes, freshly prepared
            every day. Order online or visit our nearest branch.
          </p>
          <div className='flex gap-3'>
            <Facebook className='w-5 h-5' />
            <Instagram className='w-5 h-5' />
            <Linkedin className='w-5 h-5' />
            <Music2 className='w-5 h-5' /> {/* TikTok placeholder */}
          </div>
        </div>

        {/* Explore + Help */}
        <div className='col-span-2 grid grid-cols-2 gap-10'>
          {/* Explore */}
          <div>
            <h4 className='font-semibold mb-3'>Explore</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>All Food</li>
              <li>Nearby</li>
              <li>Discount</li>
              <li>Best Seller</li>
              <li>Delivery</li>
              <li>Lunch</li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className='font-semibold mb-3'>Help</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>How to Order</li>
              <li>Payment Methods</li>
              <li>Track My Order</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
