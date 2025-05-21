import React from 'react';
import APIHandler from '../utilitati/APIHandler';

class ComponentaDetaliiFurnizor extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    console.log(props.params.id);
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    furnizorBanca: [],
    nume: "",
    adresa: "",
    nr_telefon: "",
    email: "",
    descriere: "",
    dataLoaded: false
  }
  

  // legăm corect this și prindem erorile
  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    try {
      // APIHandler e deja instanță => fără new
      const response = await APIHandler.editDateFurnizor(
        event.target.nume.value,
        event.target.adresa.value,
        event.target.nr_telefon.value,
        event.target.email.value,
        event.target.descriere.value,
        this.props.params.id
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
    const datefurnizori = await APIHandler.fetchDetaliiCompanie(this.props.params.id);
    console.log(datefurnizori);
    this.setState({furnizorBanca: datefurnizori.data.data.banca_furnizor});
    this.setState({nume: datefurnizori.data.data.nume});
    this.setState({adresa: datefurnizori.data.data.adresa});
    this.setState({nr_telefon: datefurnizori.data.data.nr_telefon});
    this.setState({email: datefurnizori.data.data.email});
    this.setState({descriere: datefurnizori.data.data.descriere});
    this.setState({dataLoaded: true});
  }

    async handleDelete(bancaFurnizorId) {
    // (opțional) confirmare
    if (!window.confirm('Ești sigur că vrei să ștergi acest cont bancar?')) {
      return;
    }

    try {
      // apelezi API-ul de ștergere
      const response = await APIHandler.deleteBancaFurnizor(bancaFurnizorId);
      console.log('Șters cu succes:', response);

      // actualizezi state: elimini din array elementul cu id-ul respectiv
      this.setState(prevState => ({
        furnizorBanca: prevState.furnizorBanca.filter(
          item => item.id !== bancaFurnizorId
        )
      }));
    } catch (err) {
      console.error('Eroare la ștergere:', err);
      // eventual afișezi un mesaj de eroare
      this.setState({ 
        errorRes: true,
        errorMessage: err.response?.data?.message || 'Eroare la ștergere'
      });
    }
  }

  viewDetaliiFurnizor = (id_furnizor) => {
    console.log(id_furnizor);
    console.log(this.props)
}

AdaugaBancaFurnizor = () => {
  this.props.navigate("/adaugaBancaFurnizor/"+this.props.params.id)
}

EditBancaFurnizor = (banca_furnizor_id) => {
  console.log(banca_furnizor_id);
  this.props.navigate("/editBancaFurnizor/"+this.props.params.id+"/"+banca_furnizor_id)
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
                  <h2>Editeaza furnizor</h2>
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
                          defaultValue={this.state.nume}
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
                          defaultValue={this.state.adresa}
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
                          defaultValue={this.state.nr_telefon}
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
                          defaultValue={this.state.email}
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
                          defaultValue={this.state.descriere}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="col-lg-6 btn btn-block btn-primary wave-effect"
                      disabled={btnMessage !== 0}
                    >
                      {btnMessage === 0
                        ? "Editare Furnizor"
                        : "Furnizorul se actualizeaza, te rog așteaptă..."}
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
                    Banca Furnizori
                  </h2>
                  <div className="header-dropdown m-r--5">
                  <button className="btn btn-info" onClick={this.AdaugaBancaFurnizor}>Adaugă Banca</button>
                  </div>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Numar cont bancar</th>
                        <th>Swift</th>
                        <th>Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.furnizorBanca.map((furnizor) => (
                       <tr key={furnizor.id}>
                        <td>{furnizor.id}</td>
                        <td>{furnizor.nr_cont_bancar}</td>
                        <td>{furnizor.swift}</td>
                        <td><button className="btn btn-block btn-warning" onClick={()=>this.EditBancaFurnizor(furnizor.id)}> Editeaza</button>
                            <button className="btn btn-block btn-danger"onClick={() => this.handleDelete(furnizor.id)} >Șterge</button>
                        </td>
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

export default ComponentaDetaliiFurnizor;
