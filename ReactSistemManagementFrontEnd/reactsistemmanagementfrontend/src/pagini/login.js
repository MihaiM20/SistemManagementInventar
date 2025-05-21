import { Link, Navigate } from 'react-router-dom';
import React from 'react';
import GoogleFontLoader from 'react-google-font-loader';
import 'adminbsb-materialdesign/plugins/bootstrap/css/bootstrap.css';
import 'adminbsb-materialdesign/plugins/node-waves/waves.css';
import 'adminbsb-materialdesign/plugins/animate-css/animate.css';
import 'adminbsb-materialdesign/css/style.css';
import AuthHandler from '../utilitati/AuthHandler';
import Config from "../utilitati/Config";

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    btnDisabled: true,
    rememberMe: false,
    loginStatus: 0,
  };

  saveInputs = (event) => {
    const key = event.target.name;
    this.setState({ [key]: event.target.value }, () => {
      if (this.state.username.length > 0 && this.state.password.length > 0) {
        this.setState({ btnDisabled: false });
      } else {
        this.setState({ btnDisabled: true });
      }
    });
  };

  handleInputChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  formSubmit = (event) => {
    event.preventDefault();
    this.setState({ loginStatus: 1 });
    AuthHandler.login(this.state.username, this.state.password, this.handleAjaxResponse);
  };

  handleAjaxResponse = (data) => {
    console.log(data);
    if (data.error) {
      this.setState({ loginStatus: 4 });
    } else {
      this.setState({ loginStatus: 3 });
      window.location=Config.acasaUrl;
    }
  };

  getMessages = () => {
    if (this.state.loginStatus === 0) {
      return "";
    } else if (this.state.loginStatus === 1) {
      return (
        <div className="alert alert-warning">
          <strong>Conectare!</strong> Te rugăm să aștepți.
        </div>
      );
    } else if (this.state.loginStatus === 3) {
      return (
        <div className="alert alert-success">
          <strong>Conectat cu succes!</strong>
        </div>
      );
    } else if (this.state.loginStatus === 4) {
      return (
        <div className="alert alert-danger">
          <strong>Date de conectare invalide!</strong>
        </div>
      );
    }
  };

  render() {

    // if(AuthHandler.loggedIn()){
    //   return <Navigate to={Config.acasaUrl} />;
    // }
    document.body.className = 'login-page';
    return (
      <React.Fragment>
        <GoogleFontLoader
          fonts={[
            {
              font: 'Roboto',
              weights: [400, '400i'],
            },
            {
              font: 'Roboto Mono',
              weights: [400, 700],
            },
          ]}
          subsets={['latin']}
        />
        <GoogleFontLoader
          fonts={[
            {
              font: 'Material+Icons',
            },
          ]}
        />
        <div className="login-box">
          <div className="logo">
            <a href="#">Sistem<b>Inventar</b></a>
            <small>Sistem Management Inventar</small>
          </div>
          <div className="card">
            <div className="body">
              <form id="sign_in" method="POST" onSubmit={this.formSubmit}>
                <div className="msg">Autentifică-te pentru a începe sesiunea</div>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="material-icons">person</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Nume utilizator"
                      required
                      autoFocus
                      onChange={this.saveInputs}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="material-icons">lock</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Parolă"
                      required
                      onChange={this.saveInputs}
                    />
                  </div>
                </div>
                {/* <div className="row"> */}
                  {/* <div className="col-xs-8 p-t-5">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      id="rememberme"
                      className="filled-in chk-col-pink"
                      checked={this.state.rememberMe}
                      onChange={this.handleInputChange}
                    />
                    <label htmlFor="rememberme">Ține minte</label>
                  </div> */}
                  <div className="row">
                    <div className="col-xs-4 col-xs-offset-4">
                      <button
                        className="btn btn-block bg-pink waves-effect animated-button"
                        type="submit"
                        disabled={this.state.btnDisabled}
                      >
                        Conectare
                      </button>
                    </div>
                  </div>
                {/* <div className="row m-t-15 m-b--20">
                  <div className="col-xs-6">
                    <Link to="/sign-up">Înregistrează-te acum!</Link>
                  </div>
                  <div className="col-xs-6 align-right">
                    <Link to="/forgot-password">Ai uitat parola?</Link>
                  </div>
                </div> */}
                {this.getMessages()}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;