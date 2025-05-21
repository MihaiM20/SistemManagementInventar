import AuthHandler from "./AuthHandler";
import Axios from "axios";
import Config from "./Config";
import { reactLocalStorage } from "reactjs-localstorage";
// Wrapper pentru toate apelurile catre API din django, pentru operatii CRUD si autentificare
// Foloseste Axios pentru a face cereri HTTP
// Verifică și reîmprospătează token-ul de autentificare daca este expirat
// Folosește react-localstorage pentru a salva token-ul de autentificare
// Folosește AuthHandler pentru a gestiona autentificarea utilizatorului

class APIHandler {
  async checkLogin() {
    try {
      // Dacă token-ul este expirat, reîmprospătează-l
      if (AuthHandler.checkTokenExpiry()) {
        const response = await Axios.post(
          Config.refreshApiUrl,
          { refresh: AuthHandler.getRefreshToken() }
        );
        reactLocalStorage.set("token", response.data.access); // Actualizează token-ul
      }
    } catch (err) {
      console.error("Eroare la reîmprospătarea token-ului:", err);
      AuthHandler.logoutUser();
      window.location = "/"; // Redirecționează la login
    }
  }

  async saveDateFurnizor(nume, adresa, nr_telefon, email, descriere) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.furnizorApiUrl,
      { nume, adresa, nr_telefon, email, descriere },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }


  async fetchAllFurnizori() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.furnizorApiUrl,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

  async fetchAllContFurnizori() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.contfurnizorApiUrl,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async fetchDetaliiCompanie(id) {
    await this.checkLogin();

    const response = await Axios.get(
      Config.furnizorApiUrl+ ""+id+"/",
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async fetchProdusByNume(nume) {
    if(nume!==""){
    await this.checkLogin();

    const response = await Axios.get(
      Config.numeProdusApiUrl+ "" +nume,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  else{
    return {data:[]}
  }
  }

  async editDateFurnizor(nume, adresa, nr_telefon, email, descriere, id) {
    await this.checkLogin();

    const response = await Axios.put(
      Config.furnizorApiUrl+ ""+id+"/",
      { nume, adresa, nr_telefon, email, descriere },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async saveDataAdaugareBancaFurnizor(nr_cont_bancar, swift, id_furnizor) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.furnizorBancaApiUrl,
      { nr_cont_bancar, swift, id_furnizor },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

  async fetchDateBancaFurnizor(id) {
    await this.checkLogin();

    const response = await Axios.get(
      Config.furnizorBancaApiUrl+ ""+id+"/",
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async editDataAdaugareBancaFurnizor(nr_cont_bancar, swift, id_furnizor,id) {
    await this.checkLogin();

    const response = await Axios.put(
      Config.furnizorBancaApiUrl+ ""+id+"/",
      { nr_cont_bancar, swift, id_furnizor },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async fetchFurnizorOnly() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.furnizorOnly,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

  async saveDataAdaugareProdus({
    nume,
    tip_produs,
    pret_cumparare,
    pret_vanzare,
    tva_produs,
    nr_lot,
    nr_raft,
    data_expirare,
    data_producere,
    id_furnizor,
    descriere,
    stoc_total,
    cantitate_in_pachet,
    detalii_produs
  }) {
    await this.checkLogin();
  
    const response = await Axios.post(
      Config.produsApiUrl,
      {
        nume,
        tip_produs,
        pret_cumparare,
        pret_vanzare,
        tva_produs,
        nr_lot,
        nr_raft,
        data_expirare,
        data_producere,
        id_furnizor,
        descriere,
        stoc_total,
        cantitate_in_pachet,
        detalii_produs
      },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );
  
    return response;
  }
  async fetchAllProduse() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.produsApiUrl,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

    async fetchAllCereriClient() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.cerereClientApiUrl,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async editProdusData({
    nume,
    tip_produs,
    pret_cumparare,
    pret_vanzare,
    tva_produs,
    nr_lot,
    nr_raft,
    data_expirare,
    data_producere,
    id_furnizor,
    descriere,
    stoc_total,
    cantitate_in_pachet,
    detalii_produs,
    id
  }) {
    await this.checkLogin();
  
    const response = await Axios.put(
      Config.produsApiUrl + id + "/",
      {
        nume,
        tip_produs,
        pret_cumparare,
        pret_vanzare,
        tva_produs,
        nr_lot,
        nr_raft,
        data_expirare,
        data_producere,
        id_furnizor,
        descriere,
        stoc_total,
        cantitate_in_pachet,
        detalii_produs
      },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );
  
    return response;
  }
  async saveDateTranzactiiFurnizor(id_furnizor, tip_tranzactie, suma_tranzactie, data_tranzactie, modalitate_plata) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.contfurnizorApiUrl,
      { id_furnizor, tip_tranzactie, suma_tranzactie, data_tranzactie, modalitate_plata },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async fetchAngajat() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.angajatApiUrl,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

    async fetchPaginaAcasa() {
    await this.checkLogin();

    const response = await Axios.get(
      Config.acasaApiUrl,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

async saveDateAngajati({ nume, prenume, email, telefon, username, parola, este_admin }) {
  await this.checkLogin();

  const response = await Axios.post(
    Config.angajatApiUrl,
    { nume, prenume, email, telefon, username, parola, este_admin },
    {
      headers: {
        Authorization: `Bearer ${AuthHandler.getLoginToken()}`
      }
    }
  );

  return response;
}


    async saveDateCerereClient(nume_client, telefon, detalii_produs) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.cerereClientApiUrl,
      { nume_client, telefon, detalii_produs },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
// APIHandler.js
async fetchAngajatByID(id) {
  await this.checkLogin();
  return Axios.get(
    `${Config.angajatApiUrl}${id}/`,
    { headers: { Authorization: `Bearer ${AuthHandler.getLoginToken()}` } }
  );
  }

async editDateAngajati({ id, nume, prenume, email, telefon, data_angajare, adresa, username, este_admin }) {
  await this.checkLogin();
  return Axios.put(
    `${Config.angajatApiUrl}${id}/`,
    { nume, prenume, email, telefon, data_angajare, adresa, username, este_admin },
    { headers: { Authorization: `Bearer ${AuthHandler.getLoginToken()}` } }
  );
}

  async fetchSalariuAngajati(id) {
    await this.checkLogin();

    const response = await Axios.get(
      Config.angajatsalariuByIDApiUrl+ id + "/",
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async fetchBancaAngajati(id) {
    await this.checkLogin();

    const response = await Axios.get(
      Config.angajatBancaByIDApiUrl+ id + "/",
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async AdaugaDateSalariuAngajati(data_salariu, suma_salariu, id_angajat) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.angajatSalariuApiUrl,
      { data_salariu, suma_salariu, id_angajat },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async AdaugaDateBancaAngajati(nr_cont_bancar, swift, id_angajat) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.angajatBancaApiUrl,
      { nr_cont_bancar, swift, id_angajat },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  async generareFactura(nume,adresa,contact,detalii_produs) {
    await this.checkLogin();

    const response = await Axios.post(
      Config.generareFacturaApiUrl,{nume:nume,adresa:adresa,contact:contact,detalii_produs:detalii_produs},
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }
  
  async actualizareCerereClient(id_client,nume_client, telefon, detalii_produs) {
        await this.checkLogin();

    const response = await Axios.put(
      Config.cerereClientApiUrl+id_client+"/",
      {
        id_client: id_client,
        nume_client: nume_client,
        telefon: telefon,
        detalii_produs: detalii_produs,
        status: 1
      },
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
}

  async deleteBancaFurnizor(id) {
    await this.checkLogin();
    const url = `${Config.furnizorBancaApiUrl}${id}/`;

    const response = await Axios.delete(
      url,
      {
        headers: {
          Authorization: `Bearer ${AuthHandler.getLoginToken()}`
        }
      }
    );

    return response;
  }

}
export default new APIHandler();
