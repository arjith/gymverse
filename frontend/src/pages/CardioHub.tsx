import { useEffect} from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCardio, fetchRandomCardio, setCardioFilters, setSelectedActivity, clearSurprise } from '../store/cardioSlice';
import CardioCard from '../components/CardioCard';
import { CardioActivity } from '../types';
import './CardioHub.scss';

const categories = ['', 'dance', 'sports', 'outdoor', 'playful', 'traditional', 'mind-body'];
const intensities = ['', 'low', 'moderate', 'high', 'hiit'];

export default function CardioHub() {
  const dispatch = useAppDispatch();
  const { activities, surpriseActivity, loading, filters } = useAppSelector((s) => s.cardio);
  const [detailActivity, setDetailActivity] = [useAppSelector((s) => s.cardio.selectedActivity), (a: CardioActivity | null) => dispatch(setSelectedActivity(a))];

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.intensityLevel) params.intensityLevel = filters.intensityLevel;
    if (filters.funRating) params.funRating = filters.funRating;
    if (filters.search) params.search = filters.search;
    dispatch(fetchCardio(params));
  }, [dispatch, filters]);

  const handleSurprise = () => {
    dispatch(fetchRandomCardio());
  };

  return (
    <div className="cardio-page">
      <div className="page-header">
        <h1>🎉 Cardio Hub</h1>
        <p>Discover fun ways to get your heart pumping — from dance to parkour to trampoline!</p>
      </div>

      <div className="cardio-page__controls">
        <div className="cardio-page__filters">
          <input
            type="text"
            placeholder="Search cardio..."
            value={filters.search}
            onChange={(e) => dispatch(setCardioFilters({ search: e.target.value }))}
          />
          <select value={filters.category} onChange={(e) => dispatch(setCardioFilters({ category: e.target.value }))}>
            {categories.map((c) => (
              <option key={c} value={c}>{c || 'All Categories'}</option>
            ))}
          </select>
          <select value={filters.intensityLevel} onChange={(e) => dispatch(setCardioFilters({ intensityLevel: e.target.value }))}>
            {intensities.map((i) => (
              <option key={i} value={i}>{i || 'All Intensities'}</option>
            ))}
          </select>
          <select value={filters.funRating} onChange={(e) => dispatch(setCardioFilters({ funRating: e.target.value }))}>
            <option value="">All Fun Levels</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={String(n)}>{'★'.repeat(n)} & up</option>
            ))}
          </select>
        </div>

        <button className="cardio-page__surprise" onClick={handleSurprise}>
          🎲 Surprise Me!
        </button>
      </div>

      {surpriseActivity && (
        <div className="cardio-page__surprise-result">
          <div className="cardio-page__surprise-header">
            <h2>✨ Your Surprise Activity</h2>
            <button onClick={() => dispatch(clearSurprise())}>✕</button>
          </div>
          <CardioCard activity={surpriseActivity} onSelect={setDetailActivity} highlight />
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <div className="cardio-page__grid">
          {activities.map((a) => (
            <CardioCard key={a.id} activity={a} onSelect={setDetailActivity} />
          ))}
          {activities.length === 0 && <p className="cardio-page__empty">No cardio activities match your filters.</p>}
        </div>
      )}

      {detailActivity && (
        <div className="cardio-page__overlay" onClick={() => setDetailActivity(null)}>
          <div className="cardio-page__detail" onClick={(e) => e.stopPropagation()}>
            <button className="cardio-page__close" onClick={() => setDetailActivity(null)}>✕</button>
            <h2>{detailActivity.name}</h2>
            <div className="cardio-page__detail-meta">
              <span className="badge badge--primary">{detailActivity.category}</span>
              <span className="badge badge--info">{detailActivity.intensityLevel}</span>
              <span>🔥 {detailActivity.caloriesPerHour} cal/hr</span>
              <span>⏱ {detailActivity.durationMin} min</span>
            </div>
            <p className="cardio-page__detail-desc">{detailActivity.description}</p>
            <div className="cardio-page__howto">
              <h3>🚀 How to Start</h3>
              <p>{detailActivity.howToStart}</p>
            </div>
            <div className="cardio-page__detail-tags">
              {detailActivity.tags.map((t) => (
                <span key={t} className="cardio-page__tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
