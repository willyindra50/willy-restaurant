import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type ApiError = { message: string };

export default function AuthPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    api?: string;
  }>({});

  // API base url (ambil dari .env)
  const API_URL = import.meta.env.VITE_API_BASE_URL as string;
  console.log('Using API_URL:', API_URL);

  // ---------- SIGN IN ----------
  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString().trim() || '';
    const password = formData.get('password')?.toString() || '';

    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post<{
        success: boolean;
        message: string;
        data: {
          user: { id: number; name: string; email: string; phone: string };
          token: string;
        };
      }>(
        `${API_URL}/auth/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/');
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrors({
          api: error.response?.data?.message || 'Login failed',
        });
      } else {
        setErrors({ api: 'Unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- SIGN UP ----------
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const password = formData.get('password')?.toString() || '';

    if (!name || !email || !phone || !password) {
      setErrors({ api: 'All fields are required' });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post<{
        success: boolean;
        message: string;
        data: {
          user: { id: number; name: string; email: string; phone: string };
          token: string;
        };
      }>(
        `${API_URL}/auth/register`,
        { name, email, phone, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/');
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrors({
          api: error.response?.data?.message || 'Register failed',
        });
      } else {
        setErrors({ api: 'Unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[1440px] h-[1024px] mx-auto flex bg-white'>
      <div
        className='w-1/2 h-full bg-cover bg-center'
        style={{ backgroundImage: "url('/burger-auth.png')" }}
      />
      <div className='w-1/2 flex flex-col justify-center px-24'>
        {/* Logo */}
        <div className='mb-8'>
          <div className='flex items-center gap-2 text-2xl font-bold'>
            <div className='w-6 h-6 rounded-full bg-red-600'></div>
            Foody
          </div>
        </div>

        {/* Title */}
        <h2 className='text-3xl font-semibold mb-2'>Welcome Back</h2>
        <p className='text-gray-500 mb-8'>Good to see you again! Let’s eat</p>

        {/* Tabs */}
        <Tabs defaultValue='signin' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-6'>
            <TabsTrigger value='signin'>Sign in</TabsTrigger>
            <TabsTrigger value='signup'>Sign up</TabsTrigger>
          </TabsList>

          {/* SIGN IN */}
          <TabsContent value='signin'>
            <form className='space-y-4' onSubmit={handleSignin}>
              <div>
                <Label>Email</Label>
                <Input name='email' placeholder='Enter your email' />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email}</p>
                )}
              </div>

              <div>
                <Label>Password</Label>
                <div className='relative'>
                  <Input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-sm'>{errors.password}</p>
                )}
              </div>

              {errors.api && (
                <p className='text-red-500 text-sm'>{errors.api}</p>
              )}

              <Button
                type='submit'
                className='w-full bg-red-600 hover:bg-red-700 text-white rounded-full'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          {/* SIGN UP */}
          <TabsContent value='signup'>
            <form className='space-y-4' onSubmit={handleSignup}>
              <div>
                <Label>Name</Label>
                <Input name='name' placeholder='Enter your name' />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input name='phone' placeholder='Enter your phone number' />
              </div>

              <div>
                <Label>Password</Label>
                <div className='relative'>
                  <Input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errors.api && (
                <p className='text-red-500 text-sm'>{errors.api}</p>
              )}

              <Button
                type='submit'
                className='w-full bg-red-600 hover:bg-red-700 text-white rounded-full'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Register'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
