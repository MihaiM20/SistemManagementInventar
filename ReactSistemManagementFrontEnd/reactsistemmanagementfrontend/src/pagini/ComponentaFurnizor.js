import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaFurnizor extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    furnizorDataList: [],
    dataLoaded: false
  }

  // legăm corect this și prindem erorile
  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    try {
      // APIHandler e deja instanță => fără new
      const response = await APIHandler.saveDateFurnizor(
        event.target.nume.value,
        event.target.adresa.value,
        event.target.nr_telefon.value,
        event.target.email.value,
        event.target.descriere.value
      );
      console.log(response);

      // update state într-o singură cheamă
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

  componentDidMount(){
    this.fetchDateFurnizori();
  }

  async fetchDateFurnizori(){
    // APIHandler e instanță, fără new
    const datefurnizori = await APIHandler.fetchAllFurnizori();
    console.log(datefurnizori);
    this.setState({furnizorDataList: datefurnizori.data.data});
    this.setState({dataLoaded: true});
  }

  viewDetaliiFurnizor = (id_furnizor) => {
    console.log("ID furnizor selectat:", id_furnizor);
    this.props.navigate("/detaliifurnizor/" + id_furnizor);
}

  render() {
    const { btnMessage, errorRes, sendData, errorMessage } = this.state;

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
                  <h2>Detalii Furnizor</h2>
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
                          placeholder="Introdu numele furnizorului"
                        />
                      </div>
                    </div>

                    <label htmlFor="adresa">Adresa</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="adresa"
                          name="adresa"
                          className="form-control"
                          placeholder="Introdu adresa furnizorului"
                        />
                      </div>
                    </div>

                    <label htmlFor="nr_telefon">Număr Telefon</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="nr_telefon"
                          name="nr_telefon"
                          className="form-control"
                          placeholder="Introdu numărul de telefon"
                        />
                      </div>
                    </div>

                    <label htmlFor="email">Email</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Introdu adresa de email"
                        />
                      </div>
                    </div>

                    <label htmlFor="descriere">Descriere</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          id="descriere"
                          name="descriere"
                          className="form-control"
                          placeholder="Introdu descrierea furnizorului"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="col-lg-6 btn btn-block btn-primary wave-effect"
                      disabled={btnMessage !== 0}
                    >
                      {btnMessage === 0
                        ? "Adaugă Furnizor"
                        : "Furnizorul se adaugă, te rog așteaptă..."}
                    </button>
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
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header">
                  {this.state.dataLoaded === false?(
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
                                ):""}
                  <h2>
                    Toți Furnizorii
                  </h2>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Nume</th>
                        <th>Adresa</th>
                        <th>Nr_telefon</th>
                        <th>Email</th>
                        <th>Descriere</th>
                        <th>Data_adăugare</th>
                        <th>Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.furnizorDataList.map((furnizor) => (
                       <tr key={furnizor.id}>
                        <td>{furnizor.id}</td>
                        <td>{furnizor.nume}</td>
                        <td>{furnizor.adresa}</td>
                        <td>{furnizor.nr_telefon}</td>
                        <td>{furnizor.email}</td>
                        <td>{furnizor.descriere}</td>
                        <td>{new Date(furnizor.data_adaugare).toLocaleString('ro-RO')}</td>
                        <td><button className="btn btn-block btn-warning" onClick={()=>this.viewDetaliiFurnizor(furnizor.id)}> Vizualizare</button></td>
                      </tr>))}
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

export default ComponentaFurnizor;
