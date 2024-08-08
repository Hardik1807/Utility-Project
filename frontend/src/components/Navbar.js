import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
// import logo from './logo.png'; // Uncomment and replace with the actual path to your logo image

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.substring(1) || 'yourcomplaint');

  // Set active tab based on current route
  React.useEffect(() => {
    setActiveTab(location.pathname.substring(1) || 'yourcomplaint');
  }, [location.pathname]);

  return (
    <div className="navbar">
      <div className="logo-container">
        <img src="" alt="logo" className="logo-image" />
        <div className="app-name">YourApp</div>
      </div>
      <div className="tabs">
        <Link 
          
          to="/yourcomplaint"
          className={`l tab ${activeTab === 'yourcomplaint' ? 'active' : ''}`}
          onClick={() => setActiveTab('yourcomplaint')}
        >
          Your Complaints
          <div className="tab-underline"></div>
        </Link>
        <Link 
        
          to="/newcomplaint" 
          className={`l tab ${activeTab === 'newcomplaint' ? 'active' : ''}`}
          onClick={() => setActiveTab('newcomplaint')}
        >
          New Complaint
          <div className="tab-underline"></div>
        </Link>
        <button className="logout-button" onClick={() => console.log('User logged out')}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
