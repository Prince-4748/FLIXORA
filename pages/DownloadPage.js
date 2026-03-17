import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Star, Calendar, Clock, DollarSign, Info, Share2, Play } from 'lucide-react';

const API_KEY = "e521e01ab9795908bb771950f9cf791d";

const DownloadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [counting, setCounting] = useState(null);
  const [timer, setTimer] = useState(5);
  // Button visibility ke liye state
  const [isPosterHovered, setIsPosterHovered] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMovie(null); 
    
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,reviews`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        if (data.videos?.results?.length > 0) {
          const official = data.videos.results.find(v => v.type === 'Trailer') || data.videos.results[0];
          setTrailerKey(official.key);
        }
        if (data.credits?.cast) setCast(data.credits.cast.slice(0, 6));
        if (data.reviews?.results) setReviews(data.reviews.results.slice(0, 3));
      })
      .catch(err => console.log("Fetch Error:", err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setSimilar(data.results.slice(0, 6)))
      .catch(err => console.log("Similar Error:", err));
  }, [id]);

  const handleDownload = (quality) => {
    setCounting(quality);
    setTimer(5);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCounting(null);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const shareMovie = () => {
    if (navigator.share) {
      navigator.share({ title: movie?.title, text: `Check out ${movie?.title} on Flixora!`, url: window.location.href });
    }
  };

  if (!movie) return (
    <div style={styles.loaderContainer}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={{...styles.backdrop, backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}} />

      <div style={styles.topNav}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          <ArrowLeft size={18} /> Back
        </button>

        <button onClick={shareMovie} style={styles.shareBtn}>
          <Share2 size={18} /> Share
        </button>
      </div>

      <div style={styles.content}>
        {/* Poster Section with Play Button Overlay */}
        <div 
          style={styles.posterSection}
          onMouseEnter={() => setIsPosterHovered(true)}
          onMouseLeave={() => setIsPosterHovered(false)}
        >
          <div style={styles.posterWrapper}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} style={styles.poster} alt="poster" />
            
            {/* Play Button Overlay */}
            <div style={{
              ...styles.playOverlay, 
              opacity: isPosterHovered ? 1 : 0,
              visibility: isPosterHovered ? 'visible' : 'hidden'
            }}>
              <button 
                onClick={() => navigate(`/player/${movie.id}`)} 
                style={styles.mainPlayBtn}
              >
                <Play fill="white" size={30} />
                <span>Watch Online Live</span>
              </button>
            </div>
          </div>
        </div>

        <div style={styles.details}>
          <h1 style={styles.title}>{movie.title}</h1>
          <div style={styles.meta}>
            <span style={styles.rating}><Star size={18} fill="#46d369" color="#46d369" /> {movie.vote_average?.toFixed(1)}</span>
            <span style={styles.metaItem}><Calendar size={18} /> {movie.release_date?.split('-')[0]}</span>
            <span style={styles.metaItem}><Clock size={18} /> {movie.runtime} min</span>
          </div>

          <div style={styles.genreContainer}>
            {movie.genres?.map((genre) => (
              <span key={genre.id} style={styles.genreTag}>{genre.name}</span>
            ))}
          </div>

          <p style={styles.desc}>{movie.overview}</p>

          <div style={styles.infoRow}>
            <div style={styles.infoItem}><Info size={16} color="#e50914" /> <strong>Status:</strong> {movie.status}</div>
            {movie.budget > 0 && (
              <div style={styles.infoItem}><DollarSign size={16} color="#e50914" /> <strong>Budget:</strong> ${movie.budget.toLocaleString()}</div>
            )}
          </div>

          {/* Cast Section */}
          <div style={styles.castSection}>
            <h3 style={styles.sectionTitle}>Top Cast</h3>
            <div style={styles.castGrid}>
              {cast.map((person) => (
                <div key={person.id} style={styles.castCard}>
                  <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/100x150?text=No+Image'} style={styles.castImage} alt={person.name} />
                  <p style={styles.castName}>{person.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download & Streaming Links Section */}
          <div style={styles.downloadSection}>
            <h3 style={styles.sectionTitle}>Streaming & Download Links</h3>
            <div style={styles.linksContainer}>
              
              {/* --- Watch Online Live Button --- */}
              <button 
                onClick={() => navigate(`/player/${movie.id}`)} 
                style={styles.liveStreamBtn}
              >
                <div style={styles.linkLeft}>
                  <Play size={22} fill="white" /> 
                  <span style={{fontSize: '1.1rem'}}>Watch Online Live (HD)</span>
                </div>
                <span style={styles.liveTag}>Server 1 - Fast</span>
              </button>

              <div style={{margin: '5px 0', color: '#666', fontSize: '0.8rem', textAlign: 'center'}}>— OR DOWNLOAD —</div>

              {/* Download Buttons */}
              {['480p', '720p', '1080p'].map((quality, index) => (
                <button key={quality} onClick={() => handleDownload(quality)} disabled={counting !== null}
                  style={{...styles.linkCard, backgroundColor: index === 2 ? '#e50914' : '#262626', opacity: counting && counting !== quality ? 0.5 : 1}}>
                  <div style={styles.linkLeft}><Download size={18} /> {counting === quality ? `Generating Link in ${timer}s...` : `Download ${quality} - BlueRay`}</div>
                  <span style={styles.tag}>High Speed</span>
                </button>
              ))}
            </div>
          </div>

          {trailerKey && (
            <div style={styles.trailerBox}>
              <h3 style={styles.sectionTitle}>Watch Official Trailer</h3>
              <div style={styles.videoResponsive}>
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`} frameBorder="0" allowFullScreen title="Official Trailer" style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
              </div>
            </div>
          )}

          {similar.length > 0 && (
            <div style={styles.similarSection}>
              <h3 style={styles.sectionTitle}>You May Also Like</h3>
              <div style={styles.similarGrid}>
                {similar.map((item) => (
                  <div key={item.id} style={styles.similarCard} onClick={() => navigate(`/movie/${item.id}`)}>
                    <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} style={styles.similarPoster} alt={item.title} />
                    <p style={styles.similarTitle}>{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '80px 6% 40px 6%', minHeight: '100vh', backgroundColor: '#141414', color: 'white', position: 'relative' },
  loaderContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, height: '450px', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, zIndex: 0 },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 },
  backBtn: { background: 'rgba(51,51,51,0.8)', color: 'white', padding: '8px 20px', borderRadius: '20px', border: '1px solid #444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  shareBtn: { background: '#e50914', color: 'white', padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  content: { position: 'relative', zIndex: 1, display: 'flex', gap: '50px', flexWrap: 'wrap' },
  posterSection: { flex: '0 0 280px', position: 'relative' },
  posterWrapper: { position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  poster: { width: '100%', display: 'block' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s ease' },
  mainPlayBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  details: { flex: '1', minWidth: '350px' },
  title: { fontSize: '2.8rem', marginBottom: '10px', fontWeight: 'bold' },
  meta: { display: 'flex', gap: '25px', marginBottom: '15px', color: '#aaa', fontSize: '18px' },
  genreContainer: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
  genreTag: { border: '1px solid #444', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', color: '#aaa', backgroundColor: 'rgba(255,255,255,0.05)' },
  desc: { lineHeight: '1.6', marginBottom: '20px', color: '#ddd', fontSize: '1.05rem', maxWidth: '800px' },
  infoRow: { display: 'flex', gap: '30px', marginBottom: '30px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid #222', width: 'fit-content' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#bbb' },
  castSection: { marginBottom: '40px' },
  castGrid: { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' },
  castCard: { flex: '0 0 100px', textAlign: 'center' },
  castImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #333' },
  castName: { fontSize: '0.75rem', marginTop: '8px', color: '#bbb' },
  downloadSection: { marginBottom: '40px' },
  sectionTitle: { borderLeft: '4px solid #e50914', paddingLeft: '15px', marginBottom: '20px', fontSize: '1.2rem' },
  linksContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  linkCard: { padding: '15px 20px', borderRadius: '8px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '800px' },
  liveStreamBtn: { 
    padding: '18px 20px', 
    borderRadius: '8px', 
    color: 'white', 
    backgroundColor: '#1f1f1f', 
    border: '2px solid #e50914', 
    cursor: 'pointer', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    maxWidth: '800px',
    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.2)' 
  },
  liveTag: { backgroundColor: '#e50914', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' },
  linkLeft: { display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold' },
  tag: { backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#999', textTransform: 'uppercase' },
  rating: { color: '#46d369', display: 'flex', alignItems: 'center', gap: '8px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  trailerBox: { marginTop: '50px', maxWidth: '800px' },
  videoResponsive: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000', border: '1px solid #333' },
  similarSection: { marginTop: '60px', width: '100%', maxWidth: '800px' },
  similarGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '20px', marginTop: '20px' },
  similarCard: { cursor: 'pointer', textAlign: 'center' },
  similarPoster: { width: '100%', borderRadius: '8px' },
  similarTitle: { fontSize: '0.8rem', marginTop: '10px', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
};

export default DownloadPage;