import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="movie-card" 
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={styles.card}
    >
      <img src={movie.image} alt={movie.title} style={styles.image} />
      <div className="card-overlay" style={styles.overlay}>
        <h4 style={styles.title}>{movie.title}</h4>
        <div style={styles.badge}>{movie.rating} ⭐</div>
        <button style={styles.btn}>
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#181818',
    transition: 'transform 0.3s ease',
  },
  image: {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
    display: 'block'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  title: { fontSize: '0.9rem', margin: 0, fontWeight: 'bold' },
  badge: { fontSize: '0.7rem', color: '#46d369' },
  btn: { 
    marginTop: '5px',
    background: '#e50914', 
    color: 'white', 
    border: 'none', 
    padding: '6px', 
    borderRadius: '4px', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    fontSize: '0.8rem'
  }
};

export default MovieCard;S