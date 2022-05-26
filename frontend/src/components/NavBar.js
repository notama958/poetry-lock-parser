import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../img/icons8-cbr-50.png';

// navigation bar
const NavBar = ({ onclick }) => {
  const [location, setLocation] = useState(useLocation());
  return (
    <nav>
      <div id="logo" role="img" aria-label="img container">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div role="navigation" className="nav">
        <ul role="tree">
          {!location.pathname.includes('package') && (
            <li role="treeitem" tabIndex="-1" aria-expanded="false">
              <button
                className="btn btn-primary"
                id="inst-button"
                onClick={onclick}
              >
                Instruction
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
