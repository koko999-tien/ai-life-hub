'use client';

import { useState, useEffect, useId } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Button, toast } from '@/components/ui';
import { fetchSkillReviews, submitSkillReview, type SkillReviewItem } from '@/lib/supabase/client';

interface SkillReviewsProps {
  skillSlug: string;
  skillName: string;
}

export function SkillReviews({ skillSlug, skillName }: SkillReviewsProps) {
  const [reviews, setReviews] = useState<SkillReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fieldIdPrefix = useId();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSkillReviews(skillSlug);
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [skillSlug]);

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá hoặc kinh nghiệm thực tế của bạn.');
      return;
    }

    setIsSubmitting(true);
    try {
      const name = userName.trim() || 'Người dùng ẩn danh';
      await submitSkillReview({
        userName: name,
        skillSlug,
        rating,
        comment: comment.trim(),
      });

      const newReview: SkillReviewItem = {
        id: `rev-${Date.now()}`,
        userName: name,
        skillSlug,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newReview, ...prev]);
      setComment('');
      setShowForm(false);
      toast.success('Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận.');
    } catch {
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800" aria-labelledby="reviews-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <h2 id="reviews-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Đánh Giá & Kinh Nghiệm Cộng Đồng
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kinh nghiệm thực tế khi áp dụng kỹ năng này vào công việc hằng ngày
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm font-bold border border-amber-200 dark:border-amber-800">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span>{averageRating} / 5</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({reviews.length} đánh giá)</span>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="text-xs"
          >
            {showForm ? 'Đóng biểu mẫu' : 'Viết đánh giá'}
          </Button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 rounded-2xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/30 dark:bg-brand-950/10">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
            Chia sẻ trải nghiệm áp dụng: {skillName}
          </h3>

          <div className="mb-4">
            <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Đánh giá sao:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  aria-label={`Đánh giá ${star} sao`}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                {rating === 5 ? 'Tuyệt vời (5/5)' : rating === 4 ? 'Rất tốt (4/5)' : `${rating}/5 sao`}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor={`${fieldIdPrefix}-username`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Tên hoặc nghề nghiệp (tùy chọn):
              </label>
              <input
                id={`${fieldIdPrefix}-username`}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ví dụ: Minh Anh (Nhân viên văn phòng)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor={`${fieldIdPrefix}-comment`}
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Kinh nghiệm / Mẹo thực tế khi dùng kỹ năng này:
            </label>
            <textarea
              id={`${fieldIdPrefix}-comment`}
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cách bạn đã tinh chỉnh câu lệnh, kết hợp công cụ hoặc kết quả đạt được..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-sm text-slate-500 py-4">Đang tải đánh giá...</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs uppercase">
                    {rev.userName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rev.userName}</h4>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5" aria-label={`${rev.rating} trên 5 sao`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 pl-11">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
