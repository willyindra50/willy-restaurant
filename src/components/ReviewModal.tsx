'use client';
import { useState } from 'react';

export interface Review {
  star: number;
  comment: string;
  createdAt: string;
  userName: string;
  avatarUrl?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  currentUserName: string;
  currentUserAvatar?: string;
  onAddReview: (review: Review) => void; // pastikan ini dikirim dari parent
}

export default function ReviewModal({
  isOpen,
  onClose,
  restaurantName,
  currentUserName,
  currentUserAvatar,
  onAddReview,
}: ReviewModalProps) {
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (star === 0) return alert('⚠️ Please give a rating!');
    if (!comment.trim()) return alert('⚠️ Please write a comment!');

    setLoading(true);

    try {
      const newReview: Review = {
        star,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        userName: currentUserName,
        avatarUrl: currentUserAvatar,
      };

      // bypass langsung ke UI
      onAddReview(newReview);

      alert('✅ Review added');
      setStar(0);
      setComment('');
      onClose();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
      <div className='bg-white rounded-xl shadow-lg w-[439px] max-w-full h-[518px] max-h-[90vh] p-6 flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Give Review</h2>
          <button onClick={onClose} className='text-gray-500 hover:text-black'>
            ✕
          </button>
        </div>

        <div className='text-center mb-4'>
          <p className='mb-2 font-medium'>Give Rating</p>
          <div className='flex justify-center gap-2'>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setStar(n)} className='text-3xl'>
                {n <= star ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className='flex-1 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400'
          placeholder={`Please share your thoughts about ${restaurantName}!`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className='mt-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2 rounded-full'
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
