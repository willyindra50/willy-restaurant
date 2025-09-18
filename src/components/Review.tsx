'use client';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReviewModal, { type Review as LocalReview } from './ReviewModal';

// Format review konsisten
interface User {
  name: string;
  avatarUrl?: string;
}

interface Review {
  id?: number;
  user: User;
  star: number;
  comment: string;
  createdAt: string;
}

// Typing untuk response BE
interface ReviewResponse {
  id: number;
  user?: { name?: string; avatarUrl?: string };
  star: number;
  comment: string;
  createdAt: string;
}

// Fetch review dari BE
async function fetchReviews(restaurantId: string): Promise<Review[]> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/review/restaurant/${restaurantId}?page=1&limit=10`,
    { headers }
  );

  if (res.status === 401) return [];
  if (!res.ok) throw new Error('Failed to fetch reviews');

  const data = await res.json();
  // ubah BE review jadi konsisten formatnya
  return (
    data.data?.reviews.map((r: ReviewResponse) => ({
      id: r.id,
      user: {
        name: r.user?.name || 'Anonymous',
        avatarUrl: r.user?.avatarUrl || '/avatar-review.png',
      },
      star: r.star,
      comment: r.comment,
      createdAt: r.createdAt,
    })) || []
  );
}

export default function ReviewSection() {
  const { id } = useParams<{ id: string }>();
  const { data: reviewsFromBE = [], isLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => fetchReviews(id!),
    enabled: !!id,
  });

  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const allReviews = [...reviewsFromBE, ...localReviews];

  const currentUser = { name: 'Demo User', avatarUrl: '/avatar-review.png' };

  return (
    <div className='max-w-[1200px] mx-auto px-8 mt-16'>
      <h3 className='text-lg font-semibold mb-4'>Review</h3>

      {isLoading ? (
        <p>Loading reviews...</p>
      ) : allReviews.length > 0 ? (
        <div className='grid md:grid-cols-2 gap-6'>
          {allReviews.map((r, idx) => (
            <div key={r.id ?? idx} className='p-4 border rounded-xl shadow-sm'>
              <div className='flex items-center gap-3 mb-2'>
                <img
                  src={r.user.avatarUrl}
                  onError={(e) => (e.currentTarget.src = '/avatar-review.png')}
                  alt={`${r.user.name} avatar`}
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div>
                  <p className='font-medium'>{r.user.name}</p>
                  <span className='text-xs text-gray-500'>
                    {new Date(r.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
              <div className='flex items-center text-yellow-400 mb-2'>
                {'★'.repeat(r.star)}
              </div>
              <p className='text-sm text-gray-700'>{r.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-sm text-gray-500'>No reviews yet.</p>
      )}

      {/* Modal hanya dipakai di MyOrder */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        restaurantName={`Restaurant ${id}`}
        currentUserName={currentUser.name}
        currentUserAvatar={currentUser.avatarUrl}
        onAddReview={(r: LocalReview) => {
          setLocalReviews((prev) => [
            {
              user: {
                name: r.userName,
                avatarUrl: r.avatarUrl || '/avatar-review.png',
              },
              star: r.star,
              comment: r.comment,
              createdAt: r.createdAt,
            },
            ...prev,
          ]);
          alert('Review added'); // notif fix
        }}
      />
    </div>
  );
}
