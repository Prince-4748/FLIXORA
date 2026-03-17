import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieRow = ({ title, movies }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.rowContainer}>
      <h2 style={styles.rowTitle}>{title}</h2>
      
      {/* YAHAN DEKHIYE: style={styles.moviesGrid} add kiya hai */}
      <div style={styles.moviesGrid}>
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            style={styles.movieCard}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img 
              src={movie.poster_path} 
              alt={movie.title} 
              style={styles.poster} 
            />
            <h3 style={styles.movieTitle}>{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  rowContainer: { padding: '20px 0', color: 'white' },
  rowTitle: { marginLeft: '20px', fontSize: '1.2rem', marginBottom: '10px' },
  moviesGrid: {
    display: 'grid',
    // Isse mobile par 2 movies aur desktop par 5-6 movies dikhengi
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
    gap: '15px',
    padding: '0 20px',
  },
  movieCard: { width: '100%', cursor: 'pointer', textAlign: 'left' },
  poster: {
    width: '100%',
    borderRadius: '8px',
    aspectRatio: '2/3', 
    objectFit: 'cover',
    display: 'block'
  },
  movieTitle: { 
    fontSize: '0.75rem', 
    marginTop: '8px', 
    color: '#e5e5e5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

export default MovieRow;