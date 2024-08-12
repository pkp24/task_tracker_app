import React from 'react';
import { NavLink } from 'react-router-dom';

function MenuBar() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/" exact="true" style={styles.link} activestyle={styles.activeLink}>
        Home
      </NavLink>
      <NavLink to="/calendar" style={styles.link} activestyle={styles.activeLink}>
        Calendar
      </NavLink>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem',
    backgroundColor: '#333',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.2rem',
  },
  activeLink: {
    fontWeight: 'bold',
    borderBottom: '2px solid #fff',
  },
};

export default MenuBar;
