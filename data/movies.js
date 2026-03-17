import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

const API_KEY = "e521e01ab9795908bb771950f9cf791d"; 
const IMG_PATH = "https://image.tmdb.org/t/p/original"; // Poori quality ke liye

const Home = ({ searchTerm }) => {
  const [movies, setMovies] = useState([]);
  const [bannerMovies, setBannerMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchURL = searchTerm 
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      : `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

    fetch(fetchURL)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setMovies(data.results);
          if (!searchTerm) setBannerMovies(data.results.slice(0, 10)); // Top 10 trending banners
        }
      });
  }, [searchTerm]);

  // Har 5 second mein banner badlega
  useEffect(() => {
    if (bannerMovies.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerMovies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [bannerMovies]);

  const currentBanner = bannerMovies[currentIndex];

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
      
      {/* --- Netflix/Bridgerton Style Hero Banner --- */}
      {!searchTerm && currentBanner && (
        <header 
          style={{
            ...styles.heroBanner,
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0) 70%), url(${IMG_PATH + currentBanner.backdrop_path})`
          }}
        >
          <div style={styles.bannerContent}>
            <h1 style={styles.bannerTitle}>{currentBanner.title}</h1>
            
            <div style={styles.bannerButtons}>
              <button style={styles.playBtn} onClick={() => navigate(`/movie/${currentBanner.id}`)}>
                Play
              </button>
              <button style={styles.myListBtn}>
                + My List
              </button>
            </div>

            <p style={styles.bannerDesc}>
              {currentBanner.overview?.substring(0, 200)}...
            </p>
          </div>
          
          {/* Bottom Shadow Taaki Grid ke saath merge ho jaye */}
          <div style={styles.bannerFadeBottom} />
        </header>
      )}

      {/* --- Movies Grid --- */}
      <div style={{ padding: searchTerm ? '120px 4% 40px 4%' : '0 4% 40px 4%', position: 'relative', zIndex: 5 }}>
        <h2 style={styles.sectionHeading}>
          {searchTerm ? `Results for: "${searchTerm}"` : "FLIXORA ORIGINALS"}
        </h2>
        <div style={styles.grid}>
          {movies.map((m) => (
            <MovieCard 
              key={m.id} 
              movie={{
                id: m.id,
                title: m.title,
                image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                rating: m.vote_average?.toFixed(1)
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroBanner: {
    height: '85vh', // Screen ka 85% area lega
    backgroundSize: 'cover',
    backgroundPosition: 'center 10%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '4%',
    position: 'relative',
    transition: 'background-image 1s ease-in-out'
  },
  bannerContent: {
    maxWidth: '500px',
    zIndex: 10
  },
  bannerTitle: {
    fontSize: '4.5rem',
    fontWeight: '800',
    marginBottom: '0.8rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  bannerButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  playBtn: {
    padding: '10px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'black',
    transition: '0.2s'
  },
  myListBtn: {
    padding: '10px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    color: 'white'
  },
  bannerDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.4',
    textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
    fontWeight: '500'
  },
  bannerFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '15rem',
    backgroundImage: 'linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.61), #111)'
  },
  sectionHeading: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'white'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px'
  }
};

export default Home;