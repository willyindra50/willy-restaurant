import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Recommended from './components/Recommended';
import Footer from './components/Footer';
import Auth from './pages/Auth';
import RestaurantDetail from './components/RestaurantDetail';
import AllRestaurant from './components/AllRestaurant';
import MyCart from './components/MyCart';
import CheckOut from './components/CheckOut';
import { CartProvider } from './context/CartContext';

// 🔹 Tambahan
import PaymentSuccess from './components/PaymentSuccess';
import MyOrder from './components/MyOrder';
import Profile from './pages/Profile';

function App() {
  return (
    <CartProvider>
      <div className='min-h-screen bg-white'>
        {/* Navbar global */}
        <Navbar />

        <div className='max-w-[1440px] w-full mx-auto px-4'>
          <Routes>
            {/* Home */}
            <Route
              path='/'
              element={
                <>
                  <Hero />
                  <Categories />
                  <Recommended />
                  <Footer />
                </>
              }
            />

            {/* Auth */}
            <Route path='/auth' element={<Auth />} />

            {/* Restaurant */}
            <Route path='/restaurant/:id' element={<RestaurantDetail />} />
            <Route path='/all-restaurant' element={<AllRestaurant />} />

            {/* Cart & Checkout */}
            <Route path='/cart' element={<MyCart />} />
            <Route path='/checkout' element={<CheckOut />} />

            {/* 🔹 Tambahan */}
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/my-order' element={<MyOrder />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
