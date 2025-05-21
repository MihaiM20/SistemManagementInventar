import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class AutoCompletareProdus extends React.Component {
  // Starea internă a componentei
  state = {
    onFocus: false,    // dacă input-ul e focalizat și se afișează dropdown-ul
    listadate: [],     // lista de produse returnată de la server
    dataLoaded: false, // dacă datele au fost încărcate cel puțin o dată
  }

  constructor(props) {
    super(props);
    // Legăm contextul `this` pentru metoda de încărcare a datelor
    this.IncarcaDateProdus = this.IncarcaDateProdus.bind(this);
    // Referință directă către elementul <input> pentru a putea modifica valoarea
    this.dateInput = React.createRef();
  }

  /**
   * Când utilizatorul dă click pe un element din listă:
   * - completează inputul cu numele produsului
   * - trimite datele produsului selectat către componenta părinte
   * - ascunde lista de sugestii
   */
  onShowItem = (item) => {
    console.log(item);
    this.dateInput.current.value = item.nume;
    this.props.incarcaDateInIntrari(this.props.pozitieObiect, item);
    this.onBlurChange();
  }

  // Afișează dropdown-ul la focus
  onFocusChange = () => {
    this.setState({ onFocus: true });
  }

  // Ascunde dropdown-ul după un mic delay (permite click-ul pe element)
  onBlurChange = () => {
    setTimeout(() => this.setState({ onFocus: false }), 100);
  }

  /**
   * Metodă apelată la fiecare schimbare în input:
   * - citește valoarea curentă
   * - face apel la API pentru a obține lista de produse după nume
   * - actualizează starea cu rezultatele
   */
  async IncarcaDateProdus(event) {
    const val = event.target.value;
    try {
      const resp = await APIHandler.fetchProdusByNume(val);
      this.setState({
        listadate: resp.data,
        dataLoaded: true,
      });
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
      // chiar și la eroare, marcăm că am încercat să încărcăm date
      this.setState({ dataLoaded: true });
    }
  }

  render() {
    const { onFocus, listadate, dataLoaded } = this.state;

    return (
      <>
        <input
          type="text"
          id="nume_produs"
          name="nume_produs"
          className="form-control"
          placeholder="Introdu nume produs"
          autoComplete="off"
          // evenimente pentru afișare / ascundere dropdown
          onFocus={this.onFocusChange}
          onBlur={this.onBlurChange}
          // apel AJAX la fiecare tastare
          onChange={this.IncarcaDateProdus}
          // referință pentru a seta valoarea programatic
          ref={this.dateInput}
        />

        {/*
          Afișăm lista de sugestii doar când:
          - input-ul e focalizat (onFocus=true)
          - datele au fost încărcate (dataLoaded=true)
          - există cel puțin un element în listă
        */}
        {onFocus && dataLoaded && listadate.length > 0 && (
          <div style={{ position: 'relative' }}>
            <ul
              style={{
                listStyleType: "none",
                margin: 0,
                padding: 0,
                border: "1px solid lightgray",
                boxShadow: "1px 1px 1px lightgray",
                position: "absolute",
                width: "100%",
                zIndex: 1,
                backgroundColor: "white"
              }}
            >
              {listadate.map((item, index) => (
                <li
                  key={index}
                  style={{
                    padding: 5,
                    borderBottom: "1px solid lightgray",
                    cursor: 'pointer'
                  }}
                  // la click, alegem produsul
                  onClick={() => this.onShowItem(item)}
                >
                  {item.nume}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
}

export default AutoCompletareProdus;
