import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class AutoCompletareClient extends React.Component {
  state = {
    onFocus: false,
    listadate: [],
    dataLoaded: false,
  }

  constructor(props) {
    super(props);
    this.IncarcaDateClient = this.IncarcaDateClient.bind(this);
    this.dateInput = React.createRef();
  }

  // Atunci când utilizatorul selectează un client din listă:
  onShowItem = (item) => {
    // Completează input-ul cu numele clientului
    this.dateInput.current.value = item.nume_client;
    // Propagă obiectul client în componenta părinte
    this.props.onSelect(item);
    this.onBlurChange();
  }

  // Afișează dropdown-ul la focus
  onFocusChange = () => this.setState({ onFocus: true });
  // Ascunde dropdown-ul după un mic delay, ca să permită click-ul
  onBlurChange = () => setTimeout(() => this.setState({ onFocus: false }), 100);

  // Metodă apelată la fiecare schimbare în input: preia toate cererile și filtrează după nume
  async IncarcaDateClient(event) {
    const val = event.target.value;
    try {
      const resp = await APIHandler.fetchAllCereriClient();
      const filtered = resp.data.data
        .filter(c => c.nume_client.toLowerCase().includes(val.toLowerCase()));
      this.setState({ listadate: filtered, dataLoaded: true });
    } catch (error) {
      console.error('Eroare la încărcarea datelor client:', error);
      this.setState({ dataLoaded: true });
    }
  }

  render() {
    const { onFocus, listadate, dataLoaded } = this.state;

    return (
      <>
        <input
          type="text"
          id="nume_client"
          name="nume_client"
          className="form-control"
          placeholder="Introdu nume client"
          autoComplete="off"
          onFocus={this.onFocusChange}
          onBlur={this.onBlurChange}
          onChange={this.IncarcaDateClient}
          ref={this.dateInput}
        />

        {onFocus && dataLoaded && listadate.length > 0 && (
          <div style={{ position: 'relative' }}>
            <ul
              style={{
                listStyleType: 'none',
                margin: 0,
                padding: 0,
                border: '1px solid lightgray',
                boxShadow: '1px 1px 1px lightgray',
                position: 'absolute',
                width: '100%',
                zIndex: 1,
                backgroundColor: 'white'
              }}
            >
              {listadate.map((item, index) => (
                <li
                  key={index}
                  style={{ padding: 5, borderBottom: '1px solid lightgray', cursor: 'pointer' }}
                  onClick={() => this.onShowItem(item)}
                >
                  {item.nume_client} — {item.telefon}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
}

export default AutoCompletareClient;
