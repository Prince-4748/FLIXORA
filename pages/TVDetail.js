import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Play, Info } from 'lucide-react';

const API_KEY = "e521e01ab9795908bb771950f9cf791d";

const TVDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // 1. TV Show ki basic details fetch karein
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setShow(data);
        setSeasons(data.seasons.filter(s => s.season_number > 0)); // Specials ko hata kar
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // 2. Jab bhi Season badle, uske episodes fetch karein
    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setEpisodes(data.episodes));
  }, [id, selectedSeason]);

  if (loading || !show) return <div style={styles.loader}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={{...styles.backdrop, backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`}} />
      
      <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>

      <div style={styles.content}>
        <div style={styles.left}>
          <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} style={styles.poster} alt="poster" />
        </div>

        <div style={styles.right}>
          <h1 style={styles.title}>{show.name}</h1>
          <div style={styles.meta}>
            <span style={styles.rating}><Star size={18} fill="#46d369" color="#46d369" /> {show.vote_average?.toFixed(1)}</span>
            <span style={styles.metaItem}><Calendar size={18} /> {show.first_air_date?.split('-')[0]}</span>
            <span style={styles.metaItem}>{show.number_of_seasons} Seasons</span>
          </div>
          <p style={styles.desc}>{show.overview}</p>

          {/* Season Selector */}
          <div style={styles.selectorSection}>
            <h3 style={styles.sectionTitle}>Select Season</h3>
            <select 
              style={styles.select} 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              {seasons.map(s => (
                <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
              ))}
            </select>
          </div>

          {/* Episodes List */}
          <div style={styles.episodeSection}>
            <h3 style={styles.sectionTitle}>Episodes ({episodes.length})</h3>
            <div style={styles.episodeGrid}>
              {episodes.map((ep) => (
                <div key={ep.id} style={styles.epCard} onClick={() => navigate(`/player/${id}/${selectedSeason}/${ep.episode_number}`)}>
                  <div style={styles.epThumbWrapper}>
                    <img 
                      src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : 'https://via.placeholder.com/300x170?text=No+Preview'} 
                      style={styles.epThumb} 
                    />
                    <div style={styles.epPlayOverlay}><Play fill="white" /></div>
                  </div>
                  <div style={styles.epInfo}>
                    <span style={styles.epNum}>E{ep.episode_number}</span>
                    <p style={styles.epName}>{ep.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '80px 6%', minHeight: '100vh', backgroundColor: '#141414', color: 'white', position: 'relative' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, height: '500px', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 },
  backBtn: { position: 'relative', zIndex: 10, background: 'rgba(51,51,51,0.8)', color: 'white', padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
  content: { display: 'flex', gap: '40px', position: 'relative', zIndex: 1, flexWrap: 'wrap' },
  left: { flex: '0 0 300px' },
  poster: { width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  right: { flex: '1', minWidth: '300px' },
  title: { fontSize: '3rem', marginBottom: '10px' },
  meta: { display: 'flex', gap: '20px', color: '#aaa', marginBottom: '20px' },
  rating: { color: '#46d369', display: 'flex', alignItems: 'center', gap: '5px' },
  desc: { color: '#ddd', lineHeight: '1.6', marginBottom: '30px', fontSize: '1.1rem' },
  sectionTitle: { borderLeft: '4px solid #e50914', paddingLeft: '12px', marginBottom: '15px' },
  select: { backgroundColor: '#222', color: 'white', padding: '10px', borderRadius: '5px', border: '1px solid #444', width: '200px', marginBottom: '30px' },
  episodeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  epCard: { cursor: 'pointer', backgroundColor: '#1f1f1f', borderRadius: '8px', overflow: 'hidden' },
  epThumbWrapper: { position: 'relative' },
  epThumb: { width: '100%', height: '120px', objectFit: 'cover' },
  epPlayOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.3s' },
  epInfo: { padding: '10px' },
  epNum: { color: '#e50914', fontWeight: 'bold', fontSize: '0.8rem' },
  epName: { fontSize: '0.9rem', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }
};

export default TVDetail;