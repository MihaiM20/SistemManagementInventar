import React from 'react';
import GoogleFontLoader from 'react-google-font-loader';
import 'adminbsb-materialdesign/css/themes/all-themes.css';
import BaraNavigare from './BaraNavigare';
import BaraLaterala from './BaraLaterala';
import IncarcarePagina from './IncarcarePagina';
import Overlay from './Overlay';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Creăm un HOC pentru a injecta hook-urile de navigație și routing în componentele de clasă
function withRouter(Component) {
  return function WrapperComponent(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    return <Component {...props} navigate={navigate} location={location} params={params} />;
  };
}

class MainComponent extends React.Component {
  state = {
    // Clasa body aplicată la rădăcină pentru theme și sidebar
    bodyClass: 'theme-red ls-closed',
    // Control pentru afișarea overlay-ului
    displayOverlay: false,
    // Lățimea ferestrei pentru responsive
    width: window.innerWidth,
  };

  componentDidMount() {
    // La montare, setăm clasa inițială și ascultăm evenimente de resize și focus
    this.updateBodyClass();
    window.addEventListener('resize', this.onscreenresize);
    document.addEventListener('focusin', this.handleFocusIn);
    document.addEventListener('focusout', this.handleFocusOut);
  }

  componentDidUpdate(prevProps, prevState) {
    // Dacă s-a schimbat clasa body, o actualizăm în DOM
    if (prevState.bodyClass !== this.state.bodyClass) {
      this.updateBodyClass();
    }
  }

  componentWillUnmount() {
    // Curățăm listener-ele când componenta e demontată
    window.removeEventListener('resize', this.onscreenresize);
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('focusout', this.handleFocusOut);
  }

  // Sincronizează clasa body a elementului root cu state.bodyClass/responsive
  updateBodyClass() {
    const root = document.getElementById('root');
    if (root) {
      root.className = this.state.width > 1150
        ? 'theme-red'                  // pe ecrane late ascunde sidebar-ul închis
        : this.state.bodyClass;        // altfel folosește clasa calculată
    }
  }

  // Toggle pentru sidebar și overlay la click pe butonul hamburger
  onBarClick = () => {
    this.setState(prev => ({
      bodyClass: prev.bodyClass === 'theme-red ls-closed'
        ? 'theme-red ls-closed overlay-open'  // deschide overlay + sidebar
        : 'theme-red ls-closed',              // închide overlay + sidebar
      displayOverlay: !prev.displayOverlay   // inversează vizibilitatea overlay-ului
    }));
  };

  // La focus pe orice input, adaugă clasa .focused la container pentru stiluri
  handleFocusIn = e => {
    if (e.target.tagName === 'INPUT') {
      e.target.parentNode.classList.add('focused');
    }
  };

  // La blur de pe input, elimină clasa .focused
  handleFocusOut = e => {
    if (e.target.tagName === 'INPUT') {
      e.target.parentNode.classList.remove('focused');
    }
  };

  // La resize de fereastră, actualizează state.width și reapelează updateBodyClass
  onscreenresize = () => {
    const newWidth = window.innerWidth;
    if (newWidth !== this.state.width) {
      this.setState({ width: newWidth }, this.updateBodyClass);
    }
  };

  render() {
    // Componenta specifică paginii este primită prin prop 'page'
    const Page = this.props.page;
    console.log("Props primite în MainComponent:", this.props);

    return (
      <>
        {/* Încarcă fonturile Google necesare */}
        <GoogleFontLoader
          fonts={[
            { font: 'Roboto', weights: [400, '400i'] },
            { font: 'Roboto Mono', weights: [400, 700] },
          ]}
          subsets={['latin']}
        />
        <GoogleFontLoader fonts={[{ font: 'Material+Icons' }]} />

        {/* Elementele de UI comune: overlay, navbar, sidebar și loader */}
        <Overlay display={this.state.displayOverlay} />
        <BaraNavigare onBarClick={this.onBarClick} />
        <BaraLaterala activepage={this.props.activepage} />
        <IncarcarePagina />

        {/* Renderizează componenta paginii cu toate props-urile disponibile */}
        <Page {...this.props} />
      </>
    );
  }
}

// Exportăm componenta cu routing injectat
export default withRouter(MainComponent);
