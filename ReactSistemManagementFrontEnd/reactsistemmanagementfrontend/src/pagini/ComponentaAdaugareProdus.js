import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaAdaugareProdus extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    furnizorlist: [],
    detaliiprodus: [
      { nume_atribut: "", valoare_atribut: "", unitate_masura: "", descriere: "" }
    ]
  }

  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    // Transformăm câmpurile numerice
    const pretCumparare = parseFloat(event.target.pret_cumparare.value);
    const pretVanzare = parseFloat(event.target.pret_vanzare.value);
    const tvaProdus = parseFloat(event.target.tva_produs.value);


    const stocTotal = parseInt(event.target.stoc_total.value, 10);
    const cantitateInPachet = parseInt(event.target.cantitate_in_pachet.value, 10);

    try {
      const response = await APIHandler.saveDataAdaugareProdus({
        nume: event.target.nume.value,
        tip_produs: event.target.tip_produs.value,
        pret_cumparare: pretCumparare,
        pret_vanzare: pretVanzare,
        tva_produs: tvaProdus,
        nr_lot: event.target.nr_lot.value,
        nr_raft: event.target.nr_raft.value,
        data_expirare: event.target.data_expirare.value,
        data_producere: event.target.data_producere.value,
        descriere: event.target.descriere_produs.value,
        stoc_total: stocTotal,
        cantitate_in_pachet: cantitateInPachet,
        id_furnizor: event.target.id_furnizor.value,
        detalii_produs: this.state.detaliiprodus
      });

      this.setState({
        btnMessage: 0,
        errorRes: response.data.error,
        errorMessage: response.data.message,
        sendData: true
      });
    } catch (err) {
      console.error("Eroare la salvare:", err);
      this.setState({
        btnMessage: 0,
        errorRes: true,
        errorMessage: err.response?.data?.message || "A apărut o eroare",
        sendData: true
      });
    }
  }

  componentDidMount() {
    this.LoadFurnizor();
  }

  async LoadFurnizor() {
    const datefurnizori = await APIHandler.fetchFurnizorOnly();
    this.setState({ furnizorlist: datefurnizori.data });
  }

  handleInput = event => {
    const { name, value } = event.target;
    const index = Number(event.target.getAttribute('data-index'));
    this.setState(prev => {
      const det = [...prev.detaliiprodus];
      det[index] = { ...det[index], [name]: value };
      return { detaliiprodus: det };
    });
  }

  AddItem = () => {
    this.setState(prev => ({
      detaliiprodus: [
        ...prev.detaliiprodus,
        { nume_atribut: "", valoare_atribut: "", unitate_masura: "", descriere: "" }
      ]
    }));
  }

  RemoveItem = () => {
    this.setState(prev => ({
      detaliiprodus:
        prev.detaliiprodus.length > 1
          ? prev.detaliiprodus.slice(0, -1)
          : prev.detaliiprodus
    }));
  }

  render() {
    const {
      btnMessage,
      errorRes,
      sendData,
      errorMessage,
      furnizorlist,
      detaliiprodus
    } = this.state;

    return (
      <section className="content">
        <div className="container-fluid">
          <div className="block-header">
            <h2>Adaugă Produse</h2>
          </div>
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Adaugă Detalii Produs</h2>
                </div>
                <div className="body">
                  <form onSubmit={this.formSubmit}>

                    {/* Câmpuri principale produs */}
                    {[
                      { label: 'Nume', id: 'nume', name: 'nume', type: 'text' },
                      { label: 'Tip Produs', id: 'tip_produs', name: 'tip_produs', type: 'text' },
                      { label: 'Preț Cumpărare', id: 'pret_cumparare', name: 'pret_cumparare', type: 'number', step: '0.01' },
                      { label: 'Preț Vânzare', id: 'pret_vanzare', name: 'pret_vanzare', type: 'number', step: '0.01' },
                      { label: 'TVA Produs', id: 'tva_produs', name: 'tva_produs', type: 'number', step: '0.01' },
                      { label: 'Nr. Lot', id: 'nr_lot', name: 'nr_lot', type: 'text' },
                      { label: 'Nr. Raft', id: 'nr_raft', name: 'nr_raft', type: 'text' },
                      { label: 'Data Expirare', id: 'data_expirare', name: 'data_expirare', type: 'date' },
                      { label: 'Data Producere', id: 'data_producere', name: 'data_producere', type: 'date' },
                      { label: 'Descriere Produs', id: 'descriere_produs', name: 'descriere_produs', type: 'text' },
                      { label: 'Stoc Total', id: 'stoc_total', name: 'stoc_total', type: 'number' },
                      { label: 'Cantitate în Pachet', id: 'cantitate_in_pachet', name: 'cantitate_in_pachet', type: 'number' }
                    ].map(field => (
                      <React.Fragment key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type={field.type}
                              id={field.id}
                              name={field.name}
                              className="form-control"
                              placeholder={`Introdu ${field.label.toLowerCase()}`}
                              {...(field.step && { step: field.step })}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}

                    {/* Select furnizor */}
                    <label htmlFor="id_furnizor">Furnizor</label>
                    <div className="form-group">
                      <select
                        id="id_furnizor"
                        name="id_furnizor"
                        className="form-control"
                        defaultValue=""  // makes the placeholder selected initially
                      >
                        {/* placeholder, outside the map, no key needed */}
                        <option value="" disabled>-- Alege furnizor --</option>

                        {/* now correctly map your furnizori */}
                        {furnizorlist.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.nume}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Butoane adaugă/șterge detalii */}
                    <div className="form-group row">
                      <div className="col-md-6">
                        <button type="button" onClick={this.AddItem} className="btn btn-success btn-block">
                          Adaugă Detaliu
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button type="button" onClick={this.RemoveItem} className="btn btn-danger btn-block">
                          Șterge Detaliu
                        </button>
                      </div>
                    </div>

                    {/* Listă detalii produs dinamice */}
                    {detaliiprodus.map((item, index) => (
                      <div className="form-group row" key={index}>
                        {['nume_atribut', 'valoare_atribut', 'unitate_masura', 'descriere'].map(key => (
                          <div className="col-md-3" key={key}>
                            <label htmlFor={key}>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                            <div className="form-line">
                              <input
                                type="text"
                                id={key}
                                name={key}
                                data-index={index}
                                className="form-control"
                                placeholder={`Introdu ${key.replace('_', ' ')}`}
                                value={item[key]}
                                onChange={this.handleInput}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Buton submit */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={btnMessage !== 0}
                    >
                      {btnMessage === 0 ? 'Adaugă Produs' : 'Se procesează...'}
                    </button>

                    {/* Mesaje succes/eroare */}
                    {sendData && !errorRes && (
                      <div className="alert alert-success mt-3">
                        <strong>Succes!</strong> {errorMessage}
                      </div>
                    )}
                    {sendData && errorRes && (
                      <div className="alert alert-danger mt-3">
                        <strong>Eroare!</strong> {errorMessage}
                      </div>
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

export default ComponentaAdaugareProdus;
