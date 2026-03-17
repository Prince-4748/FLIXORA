import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 
import Home from './pages/Home';
import DownloadPage from './pages/DownloadPage';
import Watchlist from './pages/Watchlist';
import Navbar from './components/Navbar';
import MoviePlayer from './pages/MoviePlayer';
import TVShows from './pages/TVShows';
// 1. IS LINE KO ADD KIYA HAI (IMPORT)
import TVDetail from './pages/TVDetail';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
        <Navbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        <main style={{ paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
            
            {/* Movies ke liye */}
            <Route path="/movie/:id" element={<DownloadPage />} />
            
            {/* 2. TV SHOW DETAILS KE LIYE YE ROUTE ZAROORI HAI */}
            <Route path="/tv/:id" element={<TVDetail />} />
            
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/tv-shows" element={<TVShows />} />

            {/* Players */}
            <Route path="/player/:id" element={<MoviePlayer />} />
            <Route path="/player/:id/:season/:episode" element={<MoviePlayer />} />

            {/* 3. ISKO SABSE NEECHE RAKHA HAI */}
            <Route path="*" element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;