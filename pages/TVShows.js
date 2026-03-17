import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, PlayCircle } from 'lucide-react';

const API_KEY = "e521e01ab9795908bb771950f9cf791d";

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Trending TV Shows fetch kar rahe hain
    fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setShows(data.results);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching TV shows:", err));
  }, []);

  if (loading) return (
    <div style={styles.loader}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.heading}>Trending TV Series</h2>
        <p style={styles.subHeading}>Explore the most popular web series and TV shows this week.</p>
      </header>

      <div style={styles.grid}>
        {shows.map((show) => (
          <div 
            key={show.id} 
            style={styles.card} 
            // DHAYN DEIN: Ab ye /tv/ path par jayega taaki hum TV specific details dikha sakein
            onClick={() => navigate(`/tv/${show.id}`)} 
          >
            <div style={styles.posterWrapper}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                alt={show.name} 
                style={styles.poster} 
              />
              <div style={styles.overlay}>
                <PlayCircle color="white" size={40} />
              </div>
            </div>
            <div style={styles.info}>
              <h3 style={styles.title}>{show.name}</h3>
              <div style={styles.meta}>
                <span style={styles.year}>{show.first_air_date?.split('-')[0]}</span>
                <span style={styles.rating}>
                  <Star size={14} fill="#46d369" color="#46d369" /> 
                  {show.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px 4%', minHeight: '100vh', backgroundColor: '#141414' },
  loader: { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: '30px' },
  heading: { fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' },
  subHeading: { color: '#888', fontSize: '1rem' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
    gap: '25px' 
  },
  card: { 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    backgroundColor: '#1f1f1f',
    borderRadius: '12px', // Thoda zyada rounded modern dikhne ke liye
    overflow: 'hidden',
    border: '1px solid #222'
  },
  posterWrapper: { position: 'relative', overflow: 'hidden' },
  poster: { width: '100%', height: 'auto', display: 'block' },
  overlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    opacity: 0, transition: 'opacity 0.3s ease' 
  },
  info: { padding: '12px' },
  title: { 
    fontSize: '0.95rem', fontWeight: 'bold', color: 'white', 
    marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
  },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#aaa', fontSize: '0.85rem' },
  rating: { display: 'flex', alignItems: 'center', gap: '4px', color: '#46d369' },
  year: { color: '#888' }
};

export default TVShows;