import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(star => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <Star size={20} className={star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
      </button>
    ))}
  </div>
);

const StarDisplay = ({ value }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(star => (
      <Star key={star} size={14} className={star <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
    ))}
  </div>
);

const ReviewSection = ({ targetType, targetId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [targetType, targetId]);

  const fetchReviews = async () => {
    setFetching(true);
    try {
      const params = { targetType };
      if (targetId) params.targetId = targetId;
      const res = await axios.get(`${API}/api/reviews`, { params });
      setReviews(res.data.reviews);
      setAverage(res.data.average);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) { setError('Login to leave a review.'); return; }
    if (!rating) { setError('Please select a rating.'); return; }
    if (!text.trim()) { setError('Please write something.'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/reviews`, {
        reviewerId: currentUser._id,
        targetType,
        targetId: targetId || null,
        rating,
        text
      });
      setReviews(prev => [res.data, ...prev]);
      setTotal(prev => prev + 1);
      setAverage(prev => Math.round(((prev * (total) + rating) / (total + 1)) * 10) / 10);
      setRating(0);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Summary */}
      {total > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-gray-900">{average}</span>
          <StarDisplay value={average} />
          <span className="text-sm text-gray-500">({total} reviews)</span>
        </div>
      )}

      {/* Write review */}
      {currentUser && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Leave a Review</p>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full mt-3 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 px-5 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 flex items-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Submit'}
          </button>
        </div>
      )}

      {/* Reviews list */}
      {fetching ? (
        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" size={20} /></div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No reviews yet. Be the first.</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {reviews.map(r => (
            <div key={r._id} className="flex gap-3">
              <img
                src={r.reviewer?.profile?.avatar_url}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                alt={r.reviewer?.username}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{r.reviewer?.username}</span>
                  <StarDisplay value={r.rating} />
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { StarDisplay };
export default ReviewSection;