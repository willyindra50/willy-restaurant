import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
};

export default function Profile() {
  const API_URL = import.meta.env.VITE_API_BASE_URL as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🔹 Fetch profile dari BE
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.data);
        setForm((prev) => ({
          ...prev,
          name: res.data.data.name,
          phone: res.data.data.phone,
        }));
      })
      .catch(() => setError('Failed to load profile'));
  }, [API_URL]);

  // 🔹 Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.put(
        `${API_URL}/auth/profile`,
        {
          name: form.name,
          phone: form.phone,
          currentPassword: form.currentPassword || undefined,
          newPassword: form.newPassword || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        setSuccess('Profile updated successfully');
      } else {
        setError(res.data.message);
      }
    } catch {
      // ✅ fix: no unused variable
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className='pt-20'>Loading...</p>;

  return (
    <div className='pt-20 flex min-h-screen px-4 gap-8'>
      {/* Sidebar */}
      <aside className='hidden md:block w-64 bg-white rounded-2xl shadow p-6 h-fit'>
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
        <ul className='space-y-3 text-sm'>
          <li className='cursor-pointer hover:text-orange-500'>
            Delivery Address
          </li>
          <li className='cursor-pointer hover:text-orange-500'>My Orders</li>
          <li
            className='cursor-pointer hover:text-orange-500'
            onClick={() => {
              localStorage.clear();
              window.location.href = '/auth';
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Profile Content */}
      <div className='flex-1 bg-white rounded-2xl shadow p-6'>
        <h2 className='text-xl font-bold mb-6'>Profile</h2>
        <form className='space-y-4' onSubmit={handleUpdate}>
          <div>
            <label className='block text-sm font-medium'>Name</label>
            <input
              type='text'
              className='w-full border rounded p-2'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Email</label>
            <input
              type='text'
              className='w-full border rounded p-2 bg-gray-100'
              value={user.email}
              disabled
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Phone</label>
            <input
              type='text'
              className='w-full border rounded p-2'
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>
              Current Password
            </label>
            <input
              type='password'
              className='w-full border rounded p-2'
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>New Password</label>
            <input
              type='password'
              className='w-full border rounded p-2'
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />
          </div>

          {error && <p className='text-red-500 text-sm'>{error}</p>}
          {success && <p className='text-green-500 text-sm'>{success}</p>}

          <Button
            type='submit'
            className='w-full bg-red-600 text-white rounded-full'
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
