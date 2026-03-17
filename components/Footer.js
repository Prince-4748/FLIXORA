import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.logo}>FLIXORA</div>
      <p style={styles.copyright}>Copyright © 2026. Created by ❤️ Flixora Team ❤️</p>
      <div style={styles.links}>
        <span>Contact Us</span> | <span>Request Us</span> | <span>DMCA</span> | <span>About Us</span> | <span>Sitemap</span>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1a1a1a',
    padding: '40px 20px',
    textAlign: 'center',
    color: '#808080',
    borderTop: '2px solid #333',
    marginTop: '50px'
  },
  logo: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
    letterSpacing: '2px'
  },
  copyright: { fontSize: '0.9rem', marginBottom: '15px' },
  links: { fontSize: '0.9rem', cursor: 'pointer', color: '#ccc' }
};

export default Footer;