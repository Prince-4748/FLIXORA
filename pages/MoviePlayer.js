import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server, AlertCircle } from 'lucide-react';

const MoviePlayer = () => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  
  // Default server setting
  const [server, setServer] = useState("vidsrc.xyz");

  const getEmbedUrl = (currentServer) => {
    // 2embed ka link format thoda alag hota hai, isliye condition lagayi hai
    if (currentServer === "2embed.cc") {
      return season && episode 
        ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embedmovie/${id}`;
    }
    
    // Baaki vidsrc family ke liye same format
    return season && episode 
      ? `https://${currentServer}/embed/tv?tmdb=${id}&sea=${season}&epi=${episode}`
      : `https://${currentServer}/embed/movie?tmdb=${id}`;
  };

  const servers = [
    { name: "Server 1 (Fast)", domain: "vidsrc.xyz" },
    { name: "Server 2 (Stable)", domain: "vidsrc.pm" },
    { name: "Server 3 (Backup)", domain: "vidsrc.me" },
    { name: "Server 4 (Alternative)", domain: "2embed.cc" }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Flixora
        </button>
        
        <div style={styles.serverContainer}>
          {servers.map((s) => (
            <button 
              key={s.domain}
              onClick={() => setServer(s.domain)} 
              style={{
                ...styles.sBtn, 
                backgroundColor: server === s.domain ? "#e50914" : "#222",
                border: server === s.domain ? "1px solid white" : "1px solid #444"
              }}
            >
              <Server size={14} /> {s.name}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.playerWrapper}>
        <iframe
          key={server} // Key change hone se iframe reload hoga
          src={getEmbedUrl(server)}
          style={styles.iframe}
          frameBorder="0"
          allowFullScreen
          title="Flixora Player"
        ></iframe>
      </div>

      <div style={styles.warningBar}>
        <AlertCircle size={16} />
        <span>Agar video nahi chal raha, toh upar se Server switch karein. Sabhi servers free aur safe hain.</span>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', height: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topBar: { 
    padding: '10px 2%', 
    display: 'flex', 
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'space-between', 
    alignItems: 'center',
    background: '#141414',
    borderBottom: '1px solid #333'
  },
  backBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  serverContainer: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  sBtn: { color: 'white', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.3s' },
  playerWrapper: { flex: 1, backgroundColor: '#000' },
  iframe: { width: '100%', height: '100%', border: 'none' },
  warningBar: { padding: '8px', textAlign: 'center', color: '#888', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#0a0a0a' }
};

export default MoviePlayer;