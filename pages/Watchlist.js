import React, { useState, useEffect } from 'react';
import { Heart, Trash2, PlayCircle } from 'lucide-react'; // PlayCircle import kiya
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  const loadData = () => {
    const savedList = JSON.parse(localStorage.getItem('flixora_watchlist')) || [];
    setWatchlist(savedList);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('watchlistUpdated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('watchlistUpdated', loadData);
    };
  }, []);

  const removeFromWatchlist = (e, movieId) => {
    e.stopPropagation();
    const updatedList = watchlist.filter(m => m.id !== movieId);
    setWatchlist(updatedList);
    localStorage.setItem('flixora_watchlist', JSON.stringify(updatedList));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("watchlistUpdated"));
  };

  const clearAllWatchlist = () => {
    if (window.confirm("Kya aap puri list saaf karna chahte hain?")) {
      setWatchlist([]);
      localStorage.setItem('flixora_watchlist', JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("watchlistUpdated"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrap}>
        <div style={styles.headerRow}>
          <h2 style={styles.sectionTitle}>My Watchlist ({watchlist.length})</h2>
          {watchlist.length > 0 && (
            <button onClick={clearAllWatchlist} style={styles.clearBtn}>
              <Trash2 size={18} /> Clear All
            </button>
          )}
        </div>
        
        {watchlist.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyMsg}>Aapki list abhi khali hai. Kuch movies add karein!</p>
            <button onClick={() => navigate('/')} style={styles.browseBtn}>Browse Movies</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {watchlist.map(movie => (
              <div 
                key={movie.id} 
                className="movie-card-animate" 
                style={styles.card} 
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  style={styles.poster} 
                  alt={movie.title} 
                />
                
                {/* --- Play Icon on Hover --- */}
                <div style={styles.playOverlay} className="play-overlay">
                  <PlayCircle size={60} color="white" fill="rgba(0,0,0,0.4)" style={styles.playIcon} />
                </div>
                
                <div style={styles.heartIcon} onClick={(e) => removeFromWatchlist(e, movie.id)}>
                  <Heart size={20} fill="#e50914" color="#e50914" />
                </div>
                
                <div style={styles.cardOverlay}>
                  <p style={styles.cardTitle}>{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Animation & Hover Styles */}
      <style>
        {`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .movie-card-animate {
            animation: fadeInScale 0.4s ease-out forwards;
          }
          .movie-card-animate:hover {
            transform: scale(1.05) !important;
            z-index: 5;
          }
          .play-overlay {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .movie-card-animate:hover .play-overlay {
            opacity: 1;
          }
        `}
      </style>
      <Footer />
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#141414', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' },
  contentWrap: { padding: '120px 4% 50px 4%', flex: 1 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  sectionTitle: { fontSize: '2rem', fontWeight: 'bold' },
  clearBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', backgroundColor: 'transparent', color: '#888', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', transition: '0.3s' },
  emptyContainer: { textAlign: 'center', marginTop: '100px' },
  emptyMsg: { fontSize: '1.2rem', color: '#888', marginBottom: '20px' },
  browseBtn: { padding: '10px 25px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' },
  card: { position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', height: '300px', transition: '0.3s cubic-bezier(0.4, 0, 0.4, 1)' },
  poster: { width: '100%', height: '100%', objectFit: 'cover' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  playIcon: { filter: 'drop-shadow(2px 4px 6px black)' }, // Shadow add kiya icon par
  heartIcon: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '6px', borderRadius: '50%', zIndex: 10 },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '15px' },
  cardTitle: { fontWeight: 'bold', fontSize: '0.9rem' }
};

export default Watchlist;