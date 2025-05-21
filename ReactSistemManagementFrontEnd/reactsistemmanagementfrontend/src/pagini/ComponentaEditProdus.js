import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaEditProdus extends React.Component {
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
    produsDataList: [],
    dataLoaded: false,
    nume: "",
    tip_produs: "",
    pret_cumparare: "",
    pret_vanzare: "",
    tva_produs: "",
    nr_lot: "",
    nr_raft: "",
    data_expirare: "",
    data_producere: "",
    descriere_produs: "",
    stoc_total: "",
    cantitate_in_pachet: "",
    id_furnizor: "",
    detaliiprodus: [
      { nume_atribut: "", valoare_atribut: "", unitate_masura: "", descriere: "" }
    ],
    total_atribut_list: 0,
    produs_id: 0
  };

  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });
  
    // Construim payload-ul cu toate câmpurile și id-ul produsului
    const payload = {
      nume: event.target.nume.value,
      tip_produs: event.target.tip_produs.value,
      pret_cumparare: event.target.pret_cumparare.value,
      pret_vanzare: event.target.pret_vanzare.value,
      tva_produs: event.target.tva_produs.value,
      nr_lot: event.target.nr_lot.value,
      nr_raft: event.target.nr_raft.value,
      data_expirare: event.target.data_expirare.value,
      data_producere: event.target.data_producere.value,
      descriere: event.target.descriere_produs.value,
      stoc_total: event.target.stoc_total.value,
      cantitate_in_pachet: event.target.cantitate_in_pachet.value,
      id_furnizor: event.target.id_furnizor.value,
      detalii_produs: this.state.detaliiprodus,
      id: this.state.produs_id  // asigurăm transmiterea id-ului
    };
  
    try {
      // Apelează editProdusData cu un singur obiect payload
      const response = await APIHandler.editProdusData(payload);
  
      this.setState({ 
        btnMessage: 0,
        errorRes: response.data.error,
        errorMessage: response.data.message,
        sendData: true
      });
  
      // Reîncarcă lista de produse după edit
      await this.LoadDateInitiale();
    } catch (error) {
      this.setState({
        btnMessage: 0,
        errorRes: true,
        errorMessage: error.response?.data?.message || 'A apărut o eroare',
        sendData: true
      });
    }
  }
  
  componentDidMount() {
    this.LoadDateInitiale();
  }

  // Folosește metode statice APIHandler fără instanțiere
  async LoadDateInitiale() {
    try {
      const dateFurnizori = await APIHandler.fetchFurnizorOnly();
      const dateProduse = await APIHandler.fetchAllProduse();
      
      this.setState({ 
        furnizorlist: dateFurnizori.data,
        produsDataList: dateProduse.data.data,
        dataLoaded: true,
        id_furnizor: dateFurnizori.data.length > 0 ? dateFurnizori.data[0].id : ''
      });
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
      this.setState({ dataLoaded: true });
    }
  }

  handleInput = (event) => {
    const keyname = event.target.name;
    const value = event.target.value;
    const index = event.target.getAttribute("data-index");
    
    if (index !== null) {
      const updatedDetalii = [...this.state.detaliiprodus];
      updatedDetalii[index][keyname] = value;
      this.setState({ detaliiprodus: updatedDetalii });
    } else {
      this.setState({ [keyname]: value });
    }
  };

  AddItem = () => {
    this.setState(prevState => ({
      detaliiprodus: [
        ...prevState.detaliiprodus,
        { nume_atribut: "", valoare_atribut: "", unitate_masura: "", descriere: "", id: 0}
      ]
    }));
  };

  RemoveItem = () => {
    if (this.state.detaliiprodus.length !== this.state.total_atribut_list) {
      // scoatem ultimul element
      this.state.detaliiprodus.pop(this.state.detaliiprodus.lenght - 1);
    }
    // forțăm React să re-randeze componenta
    this.setState({});
  };

  viewDetaliiProdus = (index) => {
    const produs = this.state.produsDataList[index];
    this.setState({
      produs_id: produs.id,
      nume: produs.nume,
      tip_produs: produs.tip_produs,
      pret_cumparare: produs.pret_cumparare,
      pret_vanzare: produs.pret_vanzare,
      tva_produs: produs.tva_produs,
      nr_lot: produs.nr_lot,
      nr_raft: produs.nr_raft,
      data_expirare: produs.data_expirare,
      data_producere: produs.data_producere,
      descriere_produs: produs.descriere,
      stoc_total: produs.stoc_total,
      cantitate_in_pachet: produs.cantitate_in_pachet,
      id_furnizor: produs.furnizor.id,
      total_atribut_list: produs.detalii_produs.length,
      detaliiprodus: produs.detalii_produs,
      sendData: false,
      errorRes: false,
      errorMessage: ''
    });
  };

  render() {
    return (
      <section className="content">
        <div className="container-fluid">
          <div className="block-header">
            <h2>Editează Produse</h2>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header">
                  {this.state.dataLoaded === false ? (
                    <div className="text-center">
                      <div className="preloader pl-size-xl">
                        <div className="spinner-layer">
                          <div className="circle-clipper left">
                            <div className="circle"></div>
                          </div>
                          <div className="circle-clipper right">
                            <div className="circle"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <h2>Toate produsele</h2>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Nume</th>
                        <th>Tip produs</th>
                        <th>Preț cumpărare</th>
                        <th>Preț vânzare</th>
                        <th>TVA produse</th>
                        <th>Nr. Lot</th>
                        <th>Nr. Raft</th>
                        <th>Data expirare</th>
                        <th>Data producere</th>
                        <th>Stoc total</th>
                        <th>Cant. în pachet</th>
                        <th>Descriere</th>
                        <th>Furnizor</th>
                        <th>Data adăugare</th>
                        <th>Acțiune</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.produsDataList.map((produs, index) => (
                        <tr key={produs.id}>
                          <td>{produs.id}</td>
                          <td>{produs.nume}</td>
                          <td>{produs.tip_produs}</td>
                          <td>{produs.pret_cumparare}</td>
                          <td>{produs.pret_vanzare}</td>
                          <td>{produs.tva_produs}</td>
                          <td>{produs.nr_lot}</td>
                          <td>{produs.nr_raft}</td>
                          <td>{produs.data_expirare}</td>
                          <td>{produs.data_producere}</td>
                          <td>{produs.stoc_total}</td>
                          <td>{produs.cantitate_in_pachet}</td>
                          <td>{produs.descriere}</td>
                          <td>{produs.furnizor.nume}</td>
                          <td>{new Date(produs.data_adaugare).toLocaleString('ro-RO')}</td>
                          <td>
                            <button
                              className="btn btn-block btn-warning"
                              onClick={() => this.viewDetaliiProdus(index)}
                            >
                              Vizualizare
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header">
                  <h2>Editare Detalii Produs</h2>
                </div>
                <div className="body">
                  <form onSubmit={this.formSubmit}>
                    <label htmlFor="nume">Nume</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="nume"
                          name="nume"
                          className="form-control"
                          placeholder="Introdu nume"
                          value={this.state.nume}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="tip_produs">Tip Produs</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="tip_produs"
                          name="tip_produs"
                          className="form-control"
                          placeholder="Introdu tip produs"
                          value={this.state.tip_produs}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="pret_cumparare">Preț Cumpărare</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="number"
                          id="pret_cumparare"
                          name="pret_cumparare"
                          className="form-control"
                          placeholder="Introdu preț cumpărare"
                          step="0.01"
                          value={this.state.pret_cumparare}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="pret_vanzare">Preț Vânzare</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="number"
                          id="pret_vanzare"
                          name="pret_vanzare"
                          className="form-control"
                          placeholder="Introdu preț vânzare"
                          step="0.01"
                          value={this.state.pret_vanzare}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="tva_produs">TVA Produs</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="number"
                          id="tva_produs"
                          name="tva_produs"
                          className="form-control"
                          placeholder="Introdu TVA produs"
                          step="0.01"
                          value={this.state.tva_produs}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="nr_lot">Nr. Lot</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="nr_lot"
                          name="nr_lot"
                          className="form-control"
                          placeholder="Introdu număr lot"
                          value={this.state.nr_lot}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="nr_raft">Nr. Raft</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="nr_raft"
                          name="nr_raft"
                          className="form-control"
                          placeholder="Introdu număr raft"
                          value={this.state.nr_raft}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="data_expirare">Data Expirare</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="date"
                          id="data_expirare"
                          name="data_expirare"
                          className="form-control"
                          value={this.state.data_expirare}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="data_producere">Data Producere</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="date"
                          id="data_producere"
                          name="data_producere"
                          className="form-control"
                          value={this.state.data_producere}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="descriere_produs">Descriere</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="descriere_produs"
                          name="descriere_produs"
                          className="form-control"
                          placeholder="Introdu descriere"
                          value={this.state.descriere_produs}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="stoc_total">Stoc Total</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="number"
                          id="stoc_total"
                          name="stoc_total"
                          className="form-control"
                          placeholder="Introdu stoc total"
                          value={this.state.stoc_total}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="cantitate_in_pachet">Cantitate în Pachet</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="number"
                          id="cantitate_in_pachet"
                          name="cantitate_in_pachet"
                          className="form-control"
                          placeholder="Introdu cantitate în pachet"
                          value={this.state.cantitate_in_pachet}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>

                    <label htmlFor="id_furnizor">Furnizor</label>
                    <div className="form-group">
                      <select
                        className="form-control show-tick"
                        name="id_furnizor"
                        id="id_furnizor"
                        value={this.state.id_furnizor}
                        onChange={this.handleInput}
                      >
                        {this.state.furnizorlist.map((furnizor) => (
                          <option key={furnizor.id} value={furnizor.id}>
                            {furnizor.nume}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <div className="col-lg-6">
                        <button
                          className="btn btn-block btn-success"
                          onClick={this.AddItem}
                          type="button"
                        >
                          Adaugă Detaliu
                        </button>
                      </div>
                      <div className="col-lg-6">
                        <button
                          className="btn btn-block btn-danger"
                          type="button"
                          onClick={this.RemoveItem}
                        >
                          Șterge Detaliu
                        </button>
                      </div>
                    </div>

                    {this.state.detaliiprodus.map((item, index) => (
                      <div className="form-group row" key={index}>
                        <div className="col-lg-3">
                          <label htmlFor="nume_atribut">Nume Atribut</label>
                          <div className="form-line">
                            <input
                              type="text"
                              id="nume_atribut"
                              name="nume_atribut"
                              className="form-control"
                              placeholder="Introdu nume atribut"
                              onChange={this.handleInput}
                              data-index={index}
                              value={item.nume_atribut}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <label htmlFor="valoare_atribut">Valoare Atribut</label>
                          <div className="form-line">
                            <input
                              type="text"
                              id="valoare_atribut"
                              name="valoare_atribut"
                              className="form-control"
                              placeholder="Introdu valoare atribut"
                              onChange={this.handleInput}
                              data-index={index}
                              value={item.valoare_atribut}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <label htmlFor="unitate_masura">Unitate Măsură</label>
                          <div className="form-line">
                            <input
                              type="text"
                              id="unitate_masura"
                              name="unitate_masura"
                              className="form-control"
                              placeholder="Introdu unitate măsură"
                              onChange={this.handleInput}
                              data-index={index}
                              value={item.unitate_masura}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <label htmlFor="descriere">Descriere</label>
                          <div className="form-line">
                            <input
                              type="text"
                              id="descriere"
                              name="descriere"
                              className="form-control"
                              placeholder="Introdu descriere"
                              onChange={this.handleInput}
                              data-index={index}
                              value={item.descriere}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="btn btn-primary m-t-15 waves-effect btn-block"
                      disabled={this.state.btnMessage === 0 ? false : true}
                    >
                      {this.state.btnMessage === 0
                        ? "Editează Produs"
                        : "Se actualizează produsul..."}
                    </button>

                    <br />
                    {this.state.errorRes === false &&
                    this.state.sendData === true ? (
                      <div className="alert alert-success">
                        <strong>Succes!</strong> {this.state.errorMessage}
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.errorRes === true &&
                    this.state.sendData === true ? (
                      <div className="alert alert-danger">
                        <strong>Eroare!</strong> {this.state.errorMessage}
                      </div>
                    ) : (
                      ""
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

export default ComponentaEditProdus;