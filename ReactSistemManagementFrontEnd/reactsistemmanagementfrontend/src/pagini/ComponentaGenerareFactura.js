import React from 'react';
import APIHandler from '../utilitati/APIHandler';
import AutoCompletareProdus from '../componente/AutoCompletareProdus';
import AutoCompletareClient from '../componente/AutoCompletareClient';

class ComponentaGenerareFactura extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.formRef = React.createRef();
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    successMessage: "",
    detaliiProdus: [
      {
        nr_cerere_comanda: 1,
        id: 0,
        nume_produs: "",
        cantitate: 0,
        tip_cantitate: "",
        pret_unitar: 0,
        tva_produs: 0,
        stoc_total: 0,
        suma: ""
      }
    ],
    stockExceeded: false,
    selectedClient: null,
    nrCerereCurent: 1
  };

  componentDidMount() {
    // preîncărcăm clientul dacă avem cerereId în URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('cerereId');
    if (id) {
      APIHandler.fetchAllCereriClient().then(res => {
        const cl = res.data.data.find(c => c.id == id);
        if (cl) this.onClientSelect(cl);
      });
    }
  }

  onClientSelect = (client) => {
    this.setState({ selectedClient: client });
    // completăm câmpurile din formular
    const form = this.formRef.current;
    form.nume_client.value = client.nume_client;
    form.contact.value    = client.telefon;
  }

  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    // aici luăm valorile din noul input nume_client
    const { nume_client, adresa, contact } = event.target.elements;
    const numeClient     = nume_client.value;
    const adresa_client  = adresa.value;
    const contact_client = contact.value;

    try {
      const response = await APIHandler.generareFactura(
        numeClient,
        adresa_client,
        contact_client,
        this.state.detaliiProdus
      );

      this.setState({
        btnMessage: 0,
        errorRes: response.data.error,
        errorMessage: response.data.error ? response.data.message : "",
        successMessage: !response.data.error ? response.data.message : "",
        sendData: true
      });

      if (!response.data.error) {
        this.generareFacturaPrint(numeClient, adresa_client, contact_client, this.state.detaliiProdus);
        // redirect la lista de cereri după facturare
        window.location = '/cerereClient';
      }
    } catch (err) {
      console.error('Eroare la salvare:', err);
      this.setState({
        btnMessage: 0,
        errorRes: true,
        errorMessage: err.response?.data?.message || 'A apărut o eroare',
        successMessage: "",
        sendData: true
      });
    }
  }

  clearForm() {
    if (this.formRef.current) this.formRef.current.reset();
    this.setState({
      errorRes: false,
      errorMessage: "",
      btnMessage: 0,
      sendData: false,
      detaliiProdus: [
        {
          nr_cerere_comanda: 1,
          id: 0,
          nume_produs: "",
          cantitate: "",
          tip_cantitate: "",
          pret_unitar: "",
          tva_produs: "",
          suma: ""
        }
      ],
      nrCerereCurent: 1
    });
  }

  generareFacturaPrint = (nume_client, adresa_client, contact_client, detaliiProdus) => {
    let detaliiFactura = '';
    detaliiFactura += '<html><head><title>Factura</title></head><body>';
    detaliiFactura += `<h2>Factura pentru: ${nume_client}</h2>`;
    detaliiFactura += `<p>Adresa: ${adresa_client}<br/>Contact: ${contact_client}</p>`;
    detaliiFactura += '<table border="1" cellpadding="5" cellspacing="0">';
    detaliiFactura += '<thead><tr>' +
      '<th>Nr</th>' +
      '<th>Produs</th>' +
      '<th>Cantitate</th>' +
      '<th>UM</th>' +
      '<th>PU</th>' +
      '<th>TVA(%)</th>' +
      '<th>Total</th>' +
      '</tr></thead>';
    detaliiFactura += '<tbody>';

    // Calcul total general
    let totalGeneral = 0;

    detaliiProdus.forEach((produs, idx) => {
      const linieTotal = parseFloat(produs.suma) || 0;
      totalGeneral += linieTotal;
      detaliiFactura += '<tr>' +
        `<td>${idx + 1}</td>` +
        `<td>${produs.nume_produs}</td>` +
        `<td>${produs.cantitate}</td>` +
        `<td>${produs.tip_cantitate}</td>` +
        `<td>${parseFloat(produs.pret_unitar).toFixed(2)}</td>` +
        `<td>${produs.tva_produs}</td>` +
        `<td>${linieTotal.toFixed(2)}</td>` +
        '</tr>';
    });

    detaliiFactura += '</tbody>';
    // Adăugăm footer cu total general
    detaliiFactura += '<tfoot>' +
      '<tr>' +
      '<td colspan="6" style="text-align:right"><strong>Total General</strong></td>' +
      `<td><strong>${totalGeneral.toFixed(2)}</strong></td>` +
      '</tr>' +
      '</tfoot>';

    detaliiFactura += '</table>';
    detaliiFactura += '</body></html>';

    const myWindow = window.open('', 'Factura', 'width=900,height=650,top=100,left=100');
    myWindow.document.write(detaliiFactura);
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
  };

  AdaugaDetaliiProdus = () => {
    this.setState(prev => {
      const nextNr = prev.nrCerereCurent + 1;
      return {
        nrCerereCurent: nextNr,
        detaliiProdus: [
          ...prev.detaliiProdus,
          {
            nr_cerere_comanda: nextNr,
            id: 0,
            nume_produs: '',
            cantitate: '',
            tip_cantitate: '',
            pret_unitar: '',
            tva_produs: '',
            suma: ''
          }
        ]
      };
    });
  };

  StergeDetaliiProdus = () => {
    this.setState(prev => {
      if (prev.detaliiProdus.length <= 1) return prev;
      const newList = prev.detaliiProdus.slice(0, -1);
      return {
        detaliiProdus: newList,
        nrCerereCurent: prev.nrCerereCurent - 1
      };
    });
  };

  incarcaDateInIntrari = (index, item) => {
    this.setState(prevState => {
      const pretUnitar = parseFloat(item.pret_vanzare);
      const TVA = parseFloat(item.tva_produs);
      const sumaCalculata = (1 * pretUnitar * (1 + TVA / 100)).toFixed(2);

      const updated = prevState.detaliiProdus.map((produs, i) =>
        i !== index
          ? produs
          : {
              ...produs,
              id: item.id,
              nume_produs: item.nume,
              cantitate: 1,
              tip_cantitate: 'bucati',
              pret_unitar: pretUnitar,
              tva_produs: TVA,
              stoc_total: item.stoc_total,
              suma: sumaCalculata
            }
      );

      return { detaliiProdus: updated };
    });
  };

ActualizareCantitate = event => {
  let value = Number(event.target.value);
  const index = Number(event.target.dataset.index);

  this.setState(prev => {
    const produs    = prev.detaliiProdus[index];
    const available = produs.stoc_total;

    let exceeded = false;

    // 1) normalizează
    if (value < 0) value = 0;

    // 2) dacă depășește stocul → flag + alert + capare
    if (value > available) {
      alert(`⚠️ Ai depășit stocul! Ai doar ${available} unități.`);
      exceeded = true;
      value = available;
    }

    // 3) low-stock warning
    const remaining = available - value;
    if (!exceeded && remaining > 0 && remaining < 25) {
      alert(`⚠️ Atenție, stoc aproape epuizat! Mai ai doar ${remaining} unități.`);
    }

    // 4) calculează suma
    const sumaActualizata = (
      value *
      parseFloat(produs.pret_unitar || 0) *
      (1 + parseFloat(produs.tva_produs || 0) / 100)
    ).toFixed(2);

    // 5) construiește noul array
    const newList = prev.detaliiProdus.map((p, i) =>
      i !== index
        ? p
        : { ...p, cantitate: value, suma: sumaActualizata }
    );

    return {
      detaliiProdus: newList,
      stockExceeded: exceeded
    };
  });
};
  
  render() {
    const {
      detaliiProdus,
      btnMessage,
      errorRes,
      errorMessage,
      successMessage,
      stockExceeded
    } = this.state;

    const hasStockError = detaliiProdus.some(p => Number(p.cantitate) > Number(p.stoc_total));
    const hasEmptyQty  = detaliiProdus.some(p => Number(p.cantitate) <= 0);
    const formInvalid  = hasStockError || hasEmptyQty;

    return (
      <section className="content">
        <div className="container-fluid">
          <div className="block-header">
            <h2>Gestionează Furnizor</h2>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header">
                  <h2>Factura</h2>
                </div>
                <div className="body">
                <form ref={this.formRef} onSubmit={this.formSubmit}>
                    <div className="text-right m-b-10">
                      <button type="button" className="btn btn-sm btn-danger" onClick={this.clearForm}>
                        Reset Formular
                      </button>
                    </div>
                <div className="row">
                  <div className="col-lg-6">
                    <label htmlFor="nume_client">Nume client:</label>
                    <div className="form-group">
                      <div className="form-line">
                        <AutoCompletareClient onSelect={this.onClientSelect} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor="adresa">Adresa:</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="adresa"
                          name="adresa"
                          className="form-control"
                          placeholder="Introdu adresa"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* ——— Contact (prepopulat) ——— */}
                <div className="row">
                  <div className="col-lg-6">
                    <label htmlFor="contact">Contact:</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          className="form-control"
                          placeholder="Introdu contact"
                          defaultValue={this.state.selectedClient?.telefon || ''}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                    <h4>Detalii Produse</h4>
                    {this.state.detaliiProdus.map((produs, index) =>(
                    <div className="row" key={index}>
                      <div className="col-lg-2">
                    <label htmlFor="nr_cerere_comanda">Nr cerere comanda:</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="nr_cerere_comanda"
                              name="nr_cerere_comanda"
                              className="form-control"
                              placeholder="Introdu numarul de cerere comanda"
                              defaultValue={index+1}
                            />
                          </div>
                        </div>
                        </div>
                        <div className="col-lg-2">
                    <label htmlFor="nr_cerere_comanda">Nume produs comanda: {" "}</label>
                        <div className="form-group">
                          <div className="form-line">
                            <AutoCompletareProdus pozitieObiect={index} incarcaDateInIntrari={this.incarcaDateInIntrari}/>
                          </div>
                        </div>
                        </div>
                        <div className="col-lg-2">
                    <label htmlFor="cantitate">Cantitate:</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="cantitate"
                              name="cantitate"
                              className="form-control"
                              placeholder="Introdu cantitate"
                              defaultValue={produs.cantitate}
                              data-index={index}
                              onChange={this.ActualizareCantitate}
                            />
                          </div>
                        </div>
                        </div>
                        <div className="col-lg-2">
                    <label htmlFor="tip_cantitate">Tip Cantitate:</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="tip_cantitate"
                              name="tip_cantitate"
                              className="form-control"
                              placeholder="Introdu tip cantitate"
                              defaultValue={produs.tip_cantitate}
                            />
                          </div>
                        </div>
                        </div>
                          {/* <div className="col-lg-2">
                            <label htmlFor={`tip_cantitate_${index}`}>Tip Cantitate:</label>
                            <div className="form-group">
                              <div className="form-line">
                                <select
                                  id={`tip_cantitate_${index}`}
                                  name="tip_cantitate"
                                  className="form-control"
                                  value={produs.tip_cantitate}
                                  onChange={e => {
                                    const value = e.target.value;
                                    this.setState(prev => {
                                      const updated = prev.detaliiProdus.map((p, i) =>
                                        i === index ? { ...p, tip_cantitate: value } : p
                                      );
                                      return { detaliiProdus: updated };
                                    });
                                  }}
                                >
                                  <option value="bucati">Bucăți</option>
                                  <option value="kg">Kilograme</option>
                                  <option value="litri">LitrI</option>
                                  <option value="metri">Metri</option>
                                  poţi adăuga aici alte unităţi
                                </select>
                              </div>
                            </div>
                          </div> */}
                        <div className="col-lg-2">
                    <label htmlFor="pret_unitar">Pret unitar:</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="pret_unitar"
                              name="pret_unitar"
                              className="form-control"
                              placeholder="Introdu pret unitar"
                              value={produs.pret_unitar}
                              readOnly
                            />
                          </div>
                        </div>
                        </div>
                        <div className="col-lg-2">
                    <label htmlFor="suma">Suma:</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="suma"
                              name="suma"
                              className="form-control"
                              placeholder="Introdu suma"
                              value={produs.suma}
                              readOnly
                            />
                          </div>
                        </div>
                        </div>
                        </div>
                    ))}
                    <div className="row">
                      <div className="col-lg-6">
                        <button onClick={this.AdaugaDetaliiProdus} className="btn btn-block btn-success" type="button">Adauga detalii produs</button>
                        </div>
                        <div className="col-lg-6">
                        <button onClick={this.StergeDetaliiProdus} className="btn btn-block btn-warning" type="button">Sterge detalii produs</button>
                      </div>
                    </div>
                  <button
                    type="submit"
                    className="btn btn-primary col-lg-12 m-t-17 waves-effect"
                    disabled={
                      stockExceeded ||        // dezactivează la depășirea stocului
                      hasStockError ||        // dezactivează dacă orice cantitate > stoc
                      hasEmptyQty ||          // dezactivează dacă vreo cantitate ≤ 0
                      btnMessage !== 0
                    }
                  >
                    {btnMessage === 0
                      ? "Generează Factura"
                      : "Factura se generează, te rog așteaptă."}
                  </button>
                  <br />
                  {/* Mesaj de warning imediat sub buton */}
                  {formInvalid && (
                    <div className="alert alert-warning m-t-10">
                      {hasStockError && (
                        <div>⚠️ Ai introdus o cantitate mai mare decât stocul disponibil.</div>
                      )}
                      {hasEmptyQty && (
                        <div>⚠️ Toate cantitățile trebuie să fie valori pozitive.</div>
                      )}
                    </div>
                  )}

                  {/* Mesaj de eroare / succes */}
                  {errorRes && (
                    <div className="alert alert-danger m-t-10">{errorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success m-t-10">{successMessage}</div>
                  )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ComponentaGenerareFactura;