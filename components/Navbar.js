import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 768;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const resetHome = () => {
    setSearchTerm("");
    navigate('/');
    window.scrollTo(0, 0);
  };

  return (
    <nav style={{...styles.nav, height: isMobile ? 'auto' : '70px'}}>
      <div style={{
        ...styles.navWrapper, 
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '10px 0' : '0'
      }}>
        
        {/* LEFT SECTION: Logo + Links */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          width: isMobile ? '100%' : 'auto', 
          alignItems: 'center',
          gap: isMobile ? '0' : '30px'
        }}>
          <h1 onClick={resetHome} style={{...styles.logo, fontSize: isMobile ? '1.5rem' : '1.8rem'}}>FLIXORA</h1>
          
          {!isMobile && (
            <div style={{...styles.linksGroup, gap: '20px'}}>
              <span style={{...styles.link, fontSize: '0.9rem'}} onClick={resetHome}>Home</span>
              <span style={{...styles.link, fontSize: '0.9rem'}} onClick={() => { setSearchTerm(""); navigate('/'); }}>Movies</span>
              
              {/* NAYA TV SHOWS LINK */}
              <span style={{...styles.link, fontSize: '0.9rem'}} onClick={() => navigate('/tv-shows')}>TV Shows</span>
              
              <span style={{...styles.link, fontSize: '0.9rem'}} onClick={() => navigate('/watchlist')}>My List</span>
            </div>
          )}

          {isMobile && (
            <div style={styles.profileBox}>
              <div style={{...styles.avatar, padding: '4px'}}><User size={16} color="white" /></div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Search and User Profile */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          width: isMobile ? '100%' : 'auto', 
          alignItems: 'center',
          marginTop: isMobile ? '10px' : '0'
        }}>
          {isMobile && (
            <div style={{...styles.linksGroup, gap: '12px'}}>
              <span style={{...styles.link, fontSize: '0.85rem'}} onClick={resetHome}>Home</span>
              <span style={{...styles.link, fontSize: '0.85rem'}} onClick={() => { setSearchTerm(""); navigate('/'); }}>Movies</span>
              
              {/* MOBILE TV SHOWS LINK */}
              <span style={{...styles.link, fontSize: '0.85rem'}} onClick={() => navigate('/tv-shows')}>TV</span>
              
              <span style={{...styles.link, fontSize: '0.85rem'}} onClick={() => navigate('/watchlist')}>My List</span>
            </div>
          )}
          
          <div style={{...styles.right, gap: isMobile ? '8px' : '15px'}}>
            <div style={{...styles.searchBox, padding: isMobile ? '5px 8px' : '8px 15px'}}>
              <Search size={isMobile ? 14 : 18} color="#888" />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{...styles.input, width: isMobile ? '80px' : '200px', fontSize: isMobile ? '0.8rem' : '0.9rem'}}
                value={searchTerm} 
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            
            {!isMobile && (
              <div style={styles.profileBox}>
                <div style={{...styles.avatar, padding: '6px'}}><User size={18} color="white" /></div>
                <span style={{...styles.userText, fontSize: '0.85rem'}}>User</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { width: '100%', position: 'fixed', top: 0, zIndex: 1000, backgroundColor: '#141414', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #333', transition: '0.3s' },
  navWrapper: { width: '95%', maxWidth: '1800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#e50914', fontWeight: '900', cursor: 'pointer', margin: 0 },
  linksGroup: { display: 'flex', alignItems: 'center' },
  link: { cursor: 'pointer', color: '#e5e5e5', fontWeight: '500' },
  right: { display: 'flex', alignItems: 'center' },
  searchBox: { display: 'flex', alignItems: 'center', background: '#222', borderRadius: '4px', border: '1px solid #444', marginLeft: '10px' },
  input: { background: 'none', border: 'none', color: 'white', outline: 'none', padding: '0 5px' },
  profileBox: { display: 'flex', alignItems: 'center', gap: '5px' },
  avatar: { backgroundColor: '#e50914', borderRadius: '4px', display: 'flex', alignItems: 'center' },
  userText: { color: 'white' }
};

export default Navbar;