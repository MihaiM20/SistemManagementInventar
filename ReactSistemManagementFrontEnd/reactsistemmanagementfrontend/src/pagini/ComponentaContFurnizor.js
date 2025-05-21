import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaContFurnizor extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    datecontFurnizori: [],
    dataLoaded: false,
    furnizorlist: [],
    allProducts: [],        // lista tuturor produselor
    id_furnizor: "",        // furnizorul selectat
    suma_tranzactie: 0     // suma calculată
    }

  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    try {
        const { id_furnizor, suma_tranzactie } = this.state;
        const { tip_tranzactie, data_tranzactie, modalitate_plata } = event.target;
        const response = await APIHandler.saveDateTranzactiiFurnizor(
          id_furnizor,
          tip_tranzactie.value,
          suma_tranzactie,
          data_tranzactie.value,
          modalitate_plata.value
        );
      console.log(response);

      this.setState({
        btnMessage: 0,
        errorRes: response.data.error,
        errorMessage: response.data.message,
        sendData: true,
      });
      await this.updateDataAgain();
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

async componentDidMount() {
  await this.fetchDateContFurnizori();
  // după ce ai furnizorii și conturile, încarcă toate produsele
  const respProd = await APIHandler.fetchAllProduse();
  this.setState({ allProducts: respProd.data.data });
}



async fetchDateContFurnizori() {
  const datefurnizori = await APIHandler.fetchFurnizorOnly();
  const datecont = await APIHandler.fetchAllContFurnizori();
  this.setState({
    furnizorlist: datefurnizori.data,
    datecontFurnizori: datecont.data.data,
    dataLoaded: true
  });
}


  async updateDataAgain() {
    try {
      const resp = await APIHandler.fetchAllContFurnizori();
      // actualizezi starea
      this.setState({
        datecontFurnizori: resp.data.data
      });
      console.log("Cont furnizori actualizat:", resp.data.data);
    } catch (err) {
      console.error("Eroare la actualizare date furnizori:", err);
    }
  }

handleFurnizorChange = e => {
  const idF = Number(e.target.value);
  this.setState({ id_furnizor: idF }, () => {
    // filtrează produsele după furnizor și calculează suma
    const filtrate = this.state.allProducts.filter(p => p.id_furnizor === idF || (p.furnizor && p.furnizor.id === idF));
    const total = filtrate.reduce((acc, p) => acc + p.pret_cumparare * p.stoc_total, 0);
    this.setState({ suma_tranzactie: total });
    console.log('Produse filtrate:', filtrate, '→ sumă', total);
  });
};



  viewDetaliiContFurnizor = (id) => {
    console.log("ID cont furnizor selectat:", id);
    this.props.navigate(`/detaliicontfurnizor/${id}`);
  }

  render() {
    const { btnMessage, errorRes, sendData, errorMessage } = this.state;

    return (
      <section className="content">
        <div className="container-fluid">
          <div className="block-header">
            <h2>Gestionează Cont Furnizor</h2>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Adaugă Cont Furnizor</h2>
                </div>
                <div className="body">
                  <form onSubmit={this.formSubmit}>
                    {/* Prima linie: 3 câmpuri */}
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="id_furnizor">Companie</label>
                        <div className="form-group">
                          <div className="form-line">
                        <select
                          id="id_furnizor"
                          name="id_furnizor"
                          className="form-control"
                          onChange={this.handleFurnizorChange}
                          value={this.state.id_furnizor}
                        >
                          <option value="">-- Selectează furnizor --</option>
                          {this.state.furnizorlist.map(f => (
                            <option key={f.id} value={f.id}>{f.nume}</option>
                          ))}
                        </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label htmlFor="tip_tranzactie">Tip Tranzacție</label>
                        <div className="form-group">
                          <div className="form-line">
                            <select
                              type="text"
                              id="tip_tranzactie"
                              name="tip_tranzactie"
                              className="form-control"
                            >
                              <option value="1">Debit</option>
                              <option value="2">Credit</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label htmlFor="suma_tranzactie">Sumă Tranzacție</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="number"
                              id="suma_tranzactie"
                              name="suma_tranzactie"
                              className="form-control"
                              placeholder="Introdu sumă tranzacție"
                              value={this.state.suma_tranzactie}
                              readOnly 
                                />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* A doua linie: data, modalitate, descriere */}
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="data_tranzactie">Data Tranzacție</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="date"
                              id="data_tranzactie"
                              name="data_tranzactie"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                          <div className="col-lg-4">
                          <label htmlFor="modalitate_plata">Modalitate Plată</label>
                          <div className="form-group">
                            <div className="form-line">
                              <select
                                id="modalitate_plata"
                                name="modalitate_plata"
                                className="form-control"
                                defaultValue=""
                              >
                                <option value="" disabled>-- Alege modalitatea --</option>
                                <option value="cash">Cash</option>
                                <option value="transfer_bancar">Transfer bancar</option>
                                <option value="card">Card</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="row">
                      <div className="col-lg-12 col-md-8">
                        <button
                          type="submit"
                          className="btn btn-block btn-primary"
                          disabled={btnMessage !== 0}
                        >
                          {btnMessage === 0 ? "Adaugă tranzactie" : "Tranzactia se adaugă, te rog așteaptă..."}
                        </button>
                      </div>
                    </div>

                    <br />

                    {sendData && !errorRes && (
                      <div className="alert alert-success">
                        <strong>Succes!</strong> {errorMessage}
                      </div>
                    )}
                    {sendData && errorRes && (
                      <div className="alert alert-danger">
                        <strong>Eroare!</strong> {errorMessage}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel tranzacții */}
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  {!this.state.dataLoaded && (
                    <div className="text-center">
                      <div className="preloader pl-size-xl">
                        <div className="spinner-layer">
                          <div className="circle-clipper left"><div className="circle"></div></div>
                          <div className="circle-clipper right"><div className="circle"></div></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <h2>Toate tranzacțiile cu furnizorii</h2>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Nume Furnizor</th>
                        <th>ID Furnizor</th>
                        <th>Tip Tranzactie</th>
                        <th>Suma</th>
                        <th>Data</th>
                        <th>Modalitate plata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.datecontFurnizori.map((cont) => (
                        <tr key={cont.id}>
                          <td>{cont.id}</td>
                          <td>{cont.furnizor.nume}</td>
                          <td>{cont.furnizor.id}</td>
                          <td>{(cont.furnizor.tip_tranzactie===1)?"Debit":"Credit"}</td>
                          <td>{cont.suma_tranzactie}</td>
                          <td>{cont.data_tranzactie}</td>
                          <td>{cont.modalitate_plata}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ComponentaContFurnizor;
