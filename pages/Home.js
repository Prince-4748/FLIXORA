import React, { useState, useEffect } from 'react';
import { Play, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Auth from './Auth';

const API_KEY = "e521e01ab9795908bb771950f9cf791d";

// --- Hover Card Component ---
const MovieCard = ({ movie, navigate, toggleWatchlist, isInWatchlist, isLoggedIn, setShowLogin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoKey, setVideoKey] = useState(null);

  useEffect(() => {
    let timeoutId;
    if (isHovered && !videoKey) {
      timeoutId = setTimeout(() => {
        // Movies ke liye 'movie' use hota hai, TV ke liye 'tv'
        const type = movie.media_type === 'tv' || !movie.title ? 'tv' : 'movie';
        fetch(`https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${API_KEY}`)
          .then(res => res.json())
          .then(data => {
            const trailer = data.results?.find(v => v.type === "Trailer" || v.type === "Teaser") || data.results?.[0];
            if (trailer) setVideoKey(trailer.key);
          });
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [isHovered, movie.id, videoKey, movie.title, movie.media_type]);

  const handleNavigation = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    // Agar movie.title hai toh movie page, warna tv page
    const path = movie.title ? `/movie/${movie.id}` : `/tv/${movie.id}`;
    navigate(path);
  };

  return (
    <div 
      style={styles.card} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigation}
    >
      {isHovered && videoKey ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
          style={styles.poster}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          title={movie.title || movie.name}
        />
      ) : (
        <img 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300'} 
          style={styles.poster} 
          alt={movie.title || movie.name} 
        />
      )}
      <div style={styles.heartIcon} onClick={(e) => {
        e.stopPropagation();
        if (!isLoggedIn) setShowLogin(true);
        else toggleWatchlist(e, movie);
      }}>
        <Heart size={18} fill={isInWatchlist ? "#e50914" : "none"} color={isInWatchlist ? "#e50914" : "white"} />
      </div>
      <div style={styles.cardOverlay}><p style={styles.cardTitle}>{movie.title || movie.name}</p></div>
    </div>
  );
};

// --- Movie Row Component ---
const MovieRow = ({ title, fetchUrl, navigate, toggleWatchlist, watchlist, isLoggedIn, setShowLogin }) => {
  const [rowMovies, setRowMovies] = useState([]);
  const rowRef = React.useRef(null);

  useEffect(() => {
    fetch(fetchUrl).then(res => res.json()).then(data => setRowMovies(data.results || []));
  }, [fetchUrl]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.rowWrapper}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.rowContainer}>
        <ChevronLeft style={styles.navBtnLeft} onClick={() => scroll('left')} size={40} />
        <div style={styles.rowGrid} ref={rowRef}>
          {rowMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} navigate={navigate} toggleWatchlist={toggleWatchlist} 
              isInWatchlist={!!watchlist.find(m => m.id === movie.id)} isLoggedIn={isLoggedIn} setShowLogin={setShowLogin} />
          ))}
        </div>
        <ChevronRight style={styles.navBtnRight} onClick={() => scroll('right')} size={40} />
      </div>
    </div>
  );
};

const Home = ({ searchTerm, setSearchTerm }) => {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then(res => res.json()).then(data => setGenres(data.genres));

    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then(res => res.json()).then(data => setHeroMovie(data.results[0]));

    const savedList = JSON.parse(localStorage.getItem('flixora_watchlist')) || [];
    setWatchlist(savedList);
  }, []);

  useEffect(() => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${currentPage}&sort_by=popularity.desc`;
    
    if (searchTerm) {
      // BADLAV: search/movie ko search/multi kar diya hai
      url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchTerm}&page=${currentPage}`;
    } else if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${currentPage}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (searchTerm) {
          // BADLAV: Sirf Movies aur TV shows filter kar rahe hain (Log hata rahe hain)
          const filtered = data.results?.filter(item => item.media_type === 'movie' || item.media_type === 'tv') || [];
          setMovies(filtered);
        } else {
          setMovies(data.results || []);
        }
      });
  }, [searchTerm, selectedGenre, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= 500) {
      setCurrentPage(pageNum);
      const section = document.getElementById('explore-grid');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    let pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(500, startPage + 3);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)} 
          style={{...styles.pageBtn, backgroundColor: currentPage === i ? '#e50914' : '#333'}}>
          {i}
        </button>
      );
    }
    return pages;
  };

  const toggleWatchlist = (e, movie) => {
    e.stopPropagation();
    const currentList = JSON.parse(localStorage.getItem('flixora_watchlist')) || [];
    const isSaved = currentList.find(m => m.id === movie.id);
    let updatedList = isSaved ? currentList.filter(m => m.id !== movie.id) : [...currentList, movie];
    localStorage.setItem('flixora_watchlist', JSON.stringify(updatedList));
    setWatchlist(updatedList);
    window.dispatchEvent(new Event("watchlistUpdated"));
  };

  return (
    <div style={styles.container}>
      <Navbar setSearchTerm={setSearchTerm} setShowLogin={setShowLogin} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {showLogin && (
        <div style={styles.modalOverlay} onClick={() => setShowLogin(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowLogin(false)}><X size={30} /></button>
            <Auth onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} />
          </div>
        </div>
      )}

      {!searchTerm && heroMovie && (
        <div style={{...styles.hero, backgroundImage: `linear-gradient(to top, #141414, transparent), url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`}}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{heroMovie.title}</h1>
            <button style={styles.playBtn} onClick={() => isLoggedIn ? navigate(`/movie/${heroMovie.id}`) : setShowLogin(true)}>
              <Play fill="black" size={20}/> View Details
            </button>
          </div>
        </div>
      )}

      <div style={styles.categoryBar}>
        <button style={{...styles.catBtn, borderBottom: !selectedGenre ? '3px solid #e50914' : 'none'}} onClick={() => { setSelectedGenre(null); setCurrentPage(1); }}>All</button>
        {genres.map(genre => (
          <button key={genre.id} style={{...styles.catBtn, borderBottom: selectedGenre === genre.id ? '3px solid #e50914' : 'none'}} 
            onClick={() => { setSelectedGenre(genre.id); setSearchTerm(""); setCurrentPage(1); }}>{genre.name}</button>
        ))}
      </div>

      {!searchTerm && !selectedGenre && (
        <div style={styles.rowsArea}>
          <MovieRow title="Trending Now" fetchUrl={`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`} {...{navigate, toggleWatchlist, watchlist, isLoggedIn, setShowLogin}} />
          <MovieRow title="Popular on Flixora" fetchUrl={`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`} {...{navigate, toggleWatchlist, watchlist, isLoggedIn, setShowLogin}} />
        </div>
      )}

      <div id="explore-grid" style={{paddingTop: '20px', paddingBottom: '40px'}}>
        <h2 style={styles.sectionTitle}>
          {searchTerm ? `Results for: ${searchTerm}` : selectedGenre ? 'Genre Results' : 'Explore All Movies'}
        </h2>
        <div style={styles.grid}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} navigate={navigate} toggleWatchlist={toggleWatchlist} 
              isInWatchlist={!!watchlist.find(m => m.id === movie.id)} isLoggedIn={isLoggedIn} setShowLogin={setShowLogin} />
          ))}
        </div>

        <div style={styles.paginationContainer}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={styles.arrowBtn}>
            <ChevronLeft size={20}/>
          </button>
          {renderPageNumbers()}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === 500} style={styles.arrowBtn}>
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#141414', minHeight: '100vh', color: 'white', overflowX: 'hidden' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { position: 'relative', width: '90%', maxWidth: '450px' },
  closeBtn: { position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: 'white', cursor: 'pointer' },
  hero: { height: '80vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '0 4% 100px 4%' },
  heroTitle: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' },
  playBtn: { padding: '10px 30px', borderRadius: '4px', border: 'none', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  categoryBar: { display: 'flex', gap: '20px', padding: '15px 4%', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', position: 'sticky', top: '70px', zIndex: 90, backgroundColor: '#141414' },
  catBtn: { background: 'none', border: 'none', color: '#e5e5e5', fontSize: '0.9rem', cursor: 'pointer', paddingBottom: '5px' },
  rowsArea: { marginTop: '-50px', position: 'relative', zIndex: 10 },
  rowWrapper: { marginBottom: '30px' },
  sectionTitle: { padding: '0 4%', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' },
  rowContainer: { position: 'relative', display: 'flex', alignItems: 'center' },
  rowGrid: { display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 4%' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', padding: '0 4%' },
  card: { minWidth: '160px', position: 'relative', cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', aspectRatio: '2/3' },
  poster: { width: '100%', height: '100%', objectFit: 'cover' },
  heartIcon: { position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '5px', borderRadius: '50%', zIndex: 10 },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '10px' },
  cardTitle: { fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  navBtnLeft: { position: 'absolute', left: '10px', zIndex: 20, cursor: 'pointer', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%' },
  navBtnRight: { position: 'absolute', right: '10px', zIndex: 20, cursor: 'pointer', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%' },
  paginationContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '40px 0' },
  pageBtn: { width: '35px', height: '35px', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  arrowBtn: { background: 'none', border: '1px solid #444', color: 'white', padding: '6px', cursor: 'pointer', borderRadius: '4px' }
};

export default Home;