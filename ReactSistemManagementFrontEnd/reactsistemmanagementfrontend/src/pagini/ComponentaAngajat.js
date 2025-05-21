import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaAngajat extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    listaAngajati: [],
    dataLoaded: false
  }

  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    try {
      const payload = {
        nume: event.target.nume.value,
        prenume: event.target.prenume.value,
        email: event.target.email.value,
        telefon: event.target.telefon.value,
        username: event.target.username.value,
        parola: event.target.parola.value,
        este_admin: event.target.este_admin.value === 'true'
      };

      const response = await APIHandler.saveDateAngajati(payload);

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
    this.updateDataAgain();
  }

  async updateDataAgain() {
    try {
      const resp = await APIHandler.fetchAngajat();
      this.setState({ listaAngajati: resp.data.data, dataLoaded: true });
    } catch (err) {
      console.error("Eroare la actualizare date angajati:", err);
    }
  }

  ArataDetaliiAngajati = (angid) => {
    this.props.navigate(`/detaliiangajat/${angid}`);
  }

  render() {
    const { btnMessage, errorRes, sendData, errorMessage, listaAngajati } = this.state;

    return (
      <section className="content">
        <div className="container-fluid">
          <div className="block-header">
            <h2>Gestionează Angajat</h2>
          </div>

          {/* Formular Adăugare Angajat */}
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header"><h2>Adaugă Angajat</h2></div>
                <div className="body">
                  <form onSubmit={this.formSubmit}>
                    {/* rând input-uri */}
                    <div className="row">
                      <div className="col-lg-2">
                        <label>Nume</label>
                        <input type="text" name="nume" className="form-control" required />
                      </div>
                      <div className="col-lg-2">
                        <label>Prenume</label>
                        <input type="text" name="prenume" className="form-control" required />
                      </div>
                      <div className="col-lg-2">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" required />
                      </div>
                      <div className="col-lg-2">
                        <label>Telefon</label>
                        <input type="text" name="telefon" className="form-control" required />
                      </div>
                      <div className="col-lg-2">
                        <label>Username</label>
                        <input type="text" name="username" className="form-control" required />
                      </div>
                      <div className="col-lg-2">
                        <label>Parola</label>
                        <input type="password" name="parola" className="form-control" required />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-12">
                        <label>Rol</label>
                        <select name="este_admin" className="form-control">
                          <option value="false">Angajat</option>
                          <option value="true">Admin</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block mt-3" disabled={btnMessage !== 0}>
                      {btnMessage === 0 ? "Adaugă Angajat" : "Se adaugă angajatul..."}
                    </button>

                    {sendData && (
                      <div className={`alert ${errorRes ? "alert-danger" : "alert-success"} mt-3`}>
                        <strong>{errorRes ? "Eroare!" : "Succes!"}</strong> {errorMessage}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Toți Angajații */}
          <div className="row clearfix mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="header"><h2>Toți angajații</h2></div>
                <div className="body table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Nume</th>
                        <th>Prenume</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Username</th>
                        <th>Rol</th>
                        <th>Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaAngajati.map(ang => (
                        <tr key={ang.id}>
                          <td>{ang.id}</td>
                          <td>{ang.nume}</td>
                          <td>{ang.prenume}</td>
                          <td>{ang.email}</td>
                          <td>{ang.telefon}</td>
                          <td>{ang.username}</td>
                          <td>{ang.este_admin ? 'Admin' : 'Angajat'}</td>
                          <td>
                            <button className="btn btn-primary" onClick={() => this.ArataDetaliiAngajati(ang.id)}>
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
        </div>
      </section>
    );
  }
}

export default ComponentaAngajat;
