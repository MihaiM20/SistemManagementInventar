import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaDetaliiAngajat extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    this.formSubmitSalariu = this.formSubmitSalariu.bind(this);
    this.formSubmitBanca = this.formSubmitBanca.bind(this);
    console.log(this.props.params.id);
  }

  state = {
    errorRes: false,
    errorResSalariu: false,
    errorResBanca: false,
    errorMessage: "",
    errorMessageSalariu: "",
    errorMessageBanca: "",
    btnMessage: 0,
    btnMessageSalariu: 0,
    btnMessageBanca: 0,
    sendData: false,
    listaAngajati: [],
    dataLoaded: false,
    nume: "",
    prenume: "",       // ← adaugă
    email: "",         // ← adaugă
    username: "",      // ← adaugă
    este_admin: false, // ← adaugă
    listaSalariuAngajati: [],
    listaBancaAngajati: []
  }

async formSubmit(event) {
  event.preventDefault();
  this.setState({ btnMessage: 1 });

  try {
    // capture the API response
    const response = await APIHandler.editDateAngajati({
      id:            this.props.params.id,
      nume:          event.target.nume.value,
      prenume:       event.target.prenume.value,
      email:         event.target.email.value,
      telefon:       event.target.telefon.value,
      username:      event.target.username.value,
      este_admin:    event.target.este_admin.value === "true"
    });

    console.log(response);

    this.setState({
      btnMessage:    0,
      errorRes:      response.data.error,
      errorMessage:  response.data.message,
      sendData:      true,
    });

    await this.updateDataAgain();
  } catch (err) {
    console.error("Eroare la salvare:", err);
    this.setState({
      btnMessage:   0,
      errorRes:     true,
      errorMessage: err.response?.data?.message || "A apărut o eroare",
      sendData:     true
    });
  }
}
// (a) Await your initial load
async componentDidMount() {
  try {
    await this.fetchDateAngajatiByID();
  } catch (err) {
    console.error("Eroare la încărcare detalii angajat:", err);
    this.setState({
      dataLoaded: true,
      errorRes: true,
      errorMessage: err.response?.data?.message || "A apărut o eroare la încărcare"
    });
  }
}

// (b) Always catch around your “by ID” fetch
async fetchDateAngajatiByID() {
  try {
    await this.updateDataAgain();
  } catch (err) {
    console.error("Eroare la fetchDateAngajatiByID:", err);
    this.setState({
      dataLoaded: true,
      errorRes: true,
      errorMessage: err.response?.data?.message || "Eroare server"
    });
  }
}

  async formSubmitSalariu(event) {
    event.preventDefault();
    this.setState({ btnMessageSalariu: 1 });

    try {
      const response = await APIHandler.AdaugaDateSalariuAngajati(
        event.target.data_salariu.value,
        event.target.suma_salariu.value,
        this.props.params.id
      );
      console.log(response);

      this.setState({
        btnMessageSalariu: 0,
        errorResSalariu: response.data.error,
        errorMessageSalariu: response.data.message,
        sendDataSalariu: true,
      });
      await this.updateDataAgain();
    } catch (err) {
      console.error("Eroare la salvare:", err);
      this.setState({
        btnMessageSalariu: 0,
        errorResSalariu: true,
        errorMessageSalariu: err.response?.data?.message || "A apărut o eroare",
        sendDataSalariu: true
      });
    }
  }
// (c) And in updateDataAgain()
async updateDataAgain() {
  try {
    const { data } = await APIHandler.fetchAngajatByID(this.props.params.id);
    const ang = data.data;
    this.setState({
      nume:          ang.nume,
      prenume:       ang.prenume,
      email:         ang.email,
      telefon:       ang.telefon,
      username:      ang.username,
      este_admin:    ang.este_admin,
      listaSalariuAngajati: await APIHandler.fetchSalariuAngajati(this.props.params.id).then(r => r.data),
      listaBancaAngajati:   await APIHandler.fetchBancaAngajati(this.props.params.id).then(r => r.data),
      dataLoaded:    true,
    });
  } catch (err) {
    console.error("Eroare la actualizare date angajati:", err.response?.data || err);
    this.setState({
      dataLoaded: true,
      errorRes: true,
      errorMessage: err.response?.data?.message || "Eroare server"
    });
  }
}  

  viewDetaliiContFurnizor = (id) => {
    console.log("ID cont furnizor selectat:", id);
    this.props.navigate(`/detaliicontfurnizor/${id}`);
  }

  async formSubmitBanca (event) {
    event.preventDefault();
    this.setState({ btnMessageBanca: 1 });

    try {
      const response = await APIHandler.AdaugaDateBancaAngajati(
        event.target.nr_cont_bancar.value,
        event.target.swift.value,
        this.props.params.id
      );
      console.log(response);

      this.setState({
        btnMessageBanca: 0,
        errorResBanca: response.data.error,
        errorMessageBanca: response.data.message,
        sendDataBanca: true,
      });
      await this.updateDataAgain();
    } catch (err) {
      console.error("Eroare la salvare:", err);
      this.setState({
        btnMessageBanca: 0,
        errorResBanca: true,
        errorMessageBanca: err.response?.data?.message || "A apărut o eroare",
        sendDataBanca: true
      });
    }
  }

  render() {
    const { btnMessage, errorRes, sendData, errorMessage, btnMessageSalariu, errorResSalariu, sendDataSalariu, 
      errorMessageSalariu, btnMessageBanca, errorResBanca, sendDataBanca, errorMessageBanca } = this.state;

    return (
      <section className="content">
        <div className="container-fluid">
          <div className="block-header">
            <h2>Adauga Salariu Angajat #{this.props.params.id}</h2>
          </div>
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Adauga Salariu</h2>
                </div>
                <div className="body">
                  <form onSubmit={this.formSubmitSalariu}>
                    {/* Prima linie: 3 câmpuri */}
                    <div className="row">

                      <div className="col-lg-6">
                        <label htmlFor="data_salariu">Data Salariu</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="date"
                              id="data_salariu"
                              name="data_salariu"
                              className="form-control"
                              placeholder="Introdu data salariu"
                              defaultValue={this.state.data_salariu}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label htmlFor="suma_salariu">Suma Salariu</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="number"
                              id="suma_salariu"
                              name="suma_salariu"
                              className="form-control"
                              defaultValue={this.state.suma_salariu}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-8">
                        <button
                          type="submit"
                          className="btn btn-block btn-primary"
                          disabled={btnMessageSalariu !== 0}
                        >
                          {btnMessageSalariu === 0 ? "Adauga Salariu Angajat" : "Salariul se adauga, te rog așteaptă..."}
                        </button>
                      </div>
                    </div>

                    <br />

                    {sendDataSalariu && !errorResSalariu && (
                      <div className="alert alert-success">
                        <strong>Succes!</strong> {errorMessageSalariu}
                      </div>
                    )}
                    {sendDataSalariu && errorResSalariu && (
                      <div className="alert alert-danger">
                        <strong>Eroare!</strong> {errorMessageSalariu}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
<div className="row clearfix">
  <div className="col-lg-12">
    <div className="card">
      <div className="header">
        <h2>Editează Angajat</h2>
      </div>
      <div className="body">
        <form onSubmit={this.formSubmit}>
          {/* Rând 1: nume + prenume */}
          <div className="row">
            <div className="col-lg-6">
              <label htmlFor="nume">Nume</label>
              <input
                type="text"
                id="nume"
                name="nume"
                className="form-control"
                defaultValue={this.state.nume}
              />
            </div>
            <div className="col-lg-6">
              <label htmlFor="prenume">Prenume</label>
              <input
                type="text"
                id="prenume"
                name="prenume"
                className="form-control"
                defaultValue={this.state.prenume}
              />
            </div>
          </div>

          {/* Rând 2: email + username */}
          <div className="row">
            <div className="col-lg-6">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                defaultValue={this.state.email}
              />
            </div>
            <div className="col-lg-6">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                defaultValue={this.state.username}
              />
            </div>
          </div>

          {/* Rând 3: data angajare + telefon */}
          <div className="row">
            <div className="col-lg-6">
              <label htmlFor="telefon">Telefon</label>
              <input
                type="text"
                id="telefon"
                name="telefon"
                className="form-control"
                defaultValue={this.state.telefon}
              />
            </div>

          {/* Rând 4: adresă + rol */}

            <div className="col-lg-6">
              <label htmlFor="este_admin">Rol</label>
              <select
                id="este_admin"
                name="este_admin"
                className="form-control"
                defaultValue={String(this.state.este_admin)}
              >
                <option value="false">Angajat</option>
                <option value="true">Admin</option>
              </select>
            </div>
                      </div>

          <div className="row">
            <div className="col-lg-12">
              <button
                type="submit"
                className="btn btn-block btn-primary"
                disabled={btnMessage !== 0}
              >
                {btnMessage === 0 ? "Editează Angajat" : "Se editează…"}
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
                  <h2>Salariu angajati</h2>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Data Salariu</th>
                        <th>Suma Salariu</th>
                        <th>Data Adaugare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listaSalariuAngajati.map((salariu) => (
                        <tr key={salariu.id}>
                          <td>{salariu.id}</td>
                          <td>{salariu.data_salariu}</td>
                          <td>{salariu.suma_salariu}</td>
                          <td>{new Date(salariu.data_adaugare).toLocaleString('ro-RO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2>Adauga Banca Angajat</h2>
                </div>
                <div className="body">
                  <form onSubmit={this.formSubmitBanca}>
                    {/* Prima linie: 3 câmpuri */}
                    <div className="row">

                      <div className="col-lg-6">
                        <label htmlFor="nr_cont_bancar">Numar cont bancar</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="nr_cont_bancar"
                              name="nr_cont_bancar"
                              className="form-control"
                              placeholder="Introdu numar cont bancar"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label htmlFor="swift">Swift</label>
                        <div className="form-group">
                          <div className="form-line">
                            <input
                              type="text"
                              id="swift"
                              name="swift"
                              className="form-control"
                              placeholder="Introdu swift"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-8">
                        <button
                          type="submit"
                          className="btn btn-block btn-primary"
                          disabled={btnMessageBanca !== 0}
                        >
                          {btnMessageBanca === 0 ? "Adauga Banca Angajat" : "Banca angajat se adauga, te rog așteaptă..."}
                        </button>
                      </div>
                    </div>

                    <br />

                    {sendDataBanca && !errorResBanca && (
                      <div className="alert alert-success">
                        <strong>Succes!</strong> {errorMessageBanca}
                      </div>
                    )}
                    {sendDataBanca && errorResBanca && (
                      <div className="alert alert-danger">
                        <strong>Eroare!</strong> {errorMessageBanca}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
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
                  <h2>Banca angajati</h2>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Nr Cont Bancar</th>
                        <th>Swift</th>
                        <th>Data Adaugare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.listaBancaAngajati.map((banca) => (
                        <tr key={banca.id}>
                          <td>{banca.id}</td>
                          <td>{banca.nr_cont_bancar}</td>
                          <td>{banca.swift}</td>
                          <td>{new Date(banca.data_adaugare).toLocaleString('ro-RO')}</td>
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

export default ComponentaDetaliiAngajat;
