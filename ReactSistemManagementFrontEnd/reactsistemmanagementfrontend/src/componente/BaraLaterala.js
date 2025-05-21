import React from 'react';
import { NavLink } from 'react-router-dom';
import Config from '../utilitati/Config';
import usericon from 'adminbsb-materialdesign/images/user.png';
import { reactLocalStorage } from "reactjs-localstorage";


class BaraLaterala extends React.Component {
  // Starea componentei:
  // - defaultClass: clasa HTML pentru dropdown-ul de logout (deschis/închis)
  // - hoveredKey: index-ul elementului de meniu peste care se trece cu mouse-ul
  state = {
    defaultClass: "btn-group user-helper-dropdown",
    hoveredKey: null,
    currentTime: new Date()
  };

  constructor(props) {
    super(props);
    // Referințe către elemente DOM pentru gestionarea click-urilor în afara dropdown-ului
    this.divref = React.createRef();
    this.logoutRef = React.createRef();
  }

  componentDidMount() {
    // Ascultă click-urile globale pentru a închide dropdown-ul dacă se dă click în afara lui
    document.addEventListener("mousedown", this.handleMouseClick, false);
      this.clockInterval = setInterval(() => {
    this.setState({ currentTime: new Date() });
  }, 1000);
  }

  componentWillUnmount() {
    // Curăță listener-ul când componenta e demontată
    document.removeEventListener("mousedown", this.handleMouseClick, false);
    clearInterval(this.clockInterval);
  }

  // Dacă click-ul e în afara dropdown-ului sau în afara link-ului de logout,
  // resetăm clasa dropdown-ului la starea inițială (închis)
  handleMouseClick = (event) => {
    const divCurrent = this.divref.current;
    const logoutCurrent = this.logoutRef.current;
    if (
      (divCurrent && divCurrent.contains(event.target)) ||
      (logoutCurrent && logoutCurrent.contains(event.target))
    ) {
      return; // click în interior: nu facem nimic
    }
    this.setState({ defaultClass: "btn-group user-helper-dropdown" });
  };

  // Deschide/închide dropdown-ul de logout (toggle)
  showLogoutMenu = () => {
    this.setState(prev => ({
      defaultClass:
        prev.defaultClass === "btn-group user-helper-dropdown"
          ? "btn-group user-helper-dropdown open"
          : "btn-group user-helper-dropdown"
    }));
  };

  // Setează index-ul elementului de meniu peste care trece mouse-ul
  handleMouseEnter = key => {
    this.setState({ hoveredKey: key });
  };

  // Resetează starea de hover când mouse-ul iese din element
  handleMouseLeave = () => {
    this.setState({ hoveredKey: null });
  };

  render() {
    const { hoveredKey } = this.state;
    // Preluăm obiectul 'user' cu datele salvate la login
    const user = reactLocalStorage.getObject("user");
    // Dacă ai salvat şi nume+prenume, le foloseşti; altfel username-ul
    const displayName = user?.nume && user?.prenume
      ? `${user.nume} ${user.prenume}`
      : user?.username || "Utilizator";
    const { currentTime } = this.state;
    const dateString = currentTime.toLocaleDateString("ro-RO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeString = currentTime.toLocaleTimeString("ro-RO");

        // --- calculează salutul pe baza orei ---
    const hour = currentTime.getHours();
    let salut;
    if (hour >= 5 && hour < 12) {
      salut = "Bună dimineața";
    } else if (hour >= 12 && hour < 18) {
      salut = "Bună ziua";
    } else {
      salut = "Bună seara";
    }

    return (
      <section>
        <aside id="leftsidebar" className="sidebar">
          {/* Zona de user info cu imagine și dropdown de logout */}
          <div className="user-info">
            <div className="image">
              <img src={usericon} width="48" height="48" alt="User" />
            </div>
            <div className="info-container">
              <div className="name" data-toggle="dropdown">
                {salut}, <span className="font-bold">{displayName}</span>!
              </div>
                  {/* nou: data și ceas */}
              <div className="font-italic name mt-1" style={{ fontSize: '1 rem' }}>
                {dateString}, {timeString}
              </div>
              <div
                className={this.state.defaultClass}
                ref={this.divref}
              >
                {/* Iconița pentru a deschide/închide dropdown */}
                <i
                  className="material-icons"
                  onClick={this.showLogoutMenu}
                >
                  keyboard_arrow_down
                </i>
                <ul className="dropdown-menu pull-right">
                  <li>
                    {/* Link-ul de logout */}
                    <NavLink
                      to={Config.logoutPageUrl}
                      className="waves-effect waves-block"
                      ref={this.logoutRef}
                    >
                      <i className="material-icons">input</i>
                      Sign Out
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Meniul principal */}
          <div className="menu">
            <div
              className="slimScrollDiv"
              style={{ position: 'relative', overflow: 'hidden', width: 'auto' }}
            >
              <ul className="list" style={{ overflow: 'hidden', width: 'auto' }}>
                {Config.baranavigareObiect.map((item, idx) => {
                  // Determinăm dacă elementul e hover-uit pentru a-i schimba stilul
                  const isHovered = item.index === hoveredKey;
                  return (
                    <li
                      key={idx}
                      onMouseEnter={() => this.handleMouseEnter(item.index)}
                      onMouseLeave={this.handleMouseLeave}
                      style={isHovered ? { backgroundColor: '#f2f2f2' } : {}}
                    >
                      <NavLink to={item.url} className="toggled waves-effect waves-block">
                        {({ isActive }) => (
                          <>
                            {/* Icona și textul meniului, colorate dacă ruta e activă */}
                            <i
                              className="material-icons"
                              style={{
                                marginRight: 8,
                                color: isActive ? '#e53935' : undefined
                              }}
                            >
                              {item.icons}
                            </i>
                            <span
                              style={{
                                color: isActive ? '#e53935' : undefined
                              }}
                            >
                              {item.titlu}
                            </span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </section>
    );
  }
}

export default BaraLaterala;
