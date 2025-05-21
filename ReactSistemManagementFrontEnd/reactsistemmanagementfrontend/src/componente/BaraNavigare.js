import React from 'react';
import { Link } from 'react-router-dom';

class BaraNavigare extends React.Component {
  render() {
    return (
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            {/* Iconița care declanșează evenimentul de click */}
            <a
              href="#"
              className="bars"
              onClick={this.props.onBarClick}
            />
              <Link to="/acasa" className="navbar-brand">
                Meniu
              </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default BaraNavigare;
