import React from 'react';
import APIHandler from '../utilitati/APIHandler';
import { Link } from 'react-router-dom';

class ComponentaEditBanca extends React.Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
  }

  state = {
    errorRes: false,
    errorMessage: "",
    btnMessage: 0,
    sendData: false,
    nr_cont_bancar: "",
    swift: ""
  }

  // legăm corect this și prindem erorile
  async formSubmit(event) {
    event.preventDefault();
    this.setState({ btnMessage: 1 });

    try {
      const response = await APIHandler.editDataAdaugareBancaFurnizor(
        event.target.nr_cont_bancar.value,
        event.target.swift.value,
        this.props.params.id_furnizor,
        this.props.params.id
      );
      console.log(response);

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
    this.fetchDateBancaFurnizor();
  }

  async fetchDateBancaFurnizor() {
    const datefurnizori = await APIHandler.fetchDateBancaFurnizor(this.props.params.id);
    console.log(datefurnizori);
    this.setState({
      nr_cont_bancar: datefurnizori.data.data.nr_cont_bancar,
      swift: datefurnizori.data.data.swift,
      dataLoaded: true
    });
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
                  <h2>Editează Banca Furnizor #{this.props.params.id}</h2>
                </div>
                <div className="body">
                  <form onSubmit={this.formSubmit}>
                    <label htmlFor="nr_cont_bancar">Număr cont</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="nr_cont_bancar"
                          name="nr_cont_bancar"
                          className="form-control"
                          placeholder="Introdu numărul contului bancar"
                          defaultValue={this.state.nr_cont_bancar}
                        />
                      </div>
                    </div>

                    <label htmlFor="swift">Swift</label>
                    <div className="form-group">
                      <div className="form-line">
                        <input
                          type="text"
                          id="swift"
                          name="swift"
                          className="form-control"
                          placeholder="Introdu swift-ul"
                          defaultValue={this.state.swift}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="col-lg-6 btn btn-block btn-primary wave-effect"
                      disabled={btnMessage !== 0}
                    >
                      {btnMessage === 0
                        ? "Editeaza Banca Furnizor"
                        : "Se editeaza, te rog așteaptă..."}
                    </button>
                    <br />

                    {sendData && !errorRes && (
                      <div className="alert alert-success">
                        <strong>Succes!</strong> {errorMessage}
                        <Link
                          to={`/detaliifurnizor/${this.props.params.id_furnizor}`}
                          className="btn btn-info m-t-15 waves-effect"
                        >
                          Înapoi spre detalii furnizor
                        </Link>
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
        </div>
      </section>
    );
  }
}

export default ComponentaEditBanca;
