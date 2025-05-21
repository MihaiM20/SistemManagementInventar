import React from 'react';
import APIHandler from '../utilitati/APIHandler';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const CanvasJS = CanvasJSReact.CanvasJS;

// Adăugăm cultura română
CanvasJS.addCultureInfo("ro", {
  decimalSeparator: ",",
  digitGroupSeparator: ".",
  days: ["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"],
  shortDays: ["Du","Lu","Ma","Mi","Jo","Vi","Sâ"],
  months: ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],
  shortMonths: ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"]
});

class ComponentaAcasa extends React.Component {

    constructor ( props ) {
        super( props );
        this.chart = React.createRef();

    }
    state = {
        cerere_client: 0,
        nr_facturi: 0,
        total_produse: 0,
        total_furnizori: 0,
        total_angajati: 0,
        suma_profit: 0,
        suma_vanzare: 0,
        cerere_client_asteptare: 0,
        cerere_client_completate: 0,
        suma_profit_azi:0,
        suma_vanzare_azi:0,
        data_produse_expirate_serializer:0,
        DiagramaProfit:{},
        DiagramaVanzari:{}
    }
    componentDidMount(){
      this.fetchPaginaAcasa();
    }
    
    async fetchPaginaAcasa(){

      const dateacasa = await APIHandler.fetchPaginaAcasa();
      console.log(dateacasa);
      this.setState({
        cerere_client: dateacasa.data.cerere_client,
        nr_facturi: dateacasa.data.nr_facturi,
        total_produse: dateacasa.data.total_produse,
        total_furnizori: dateacasa.data.total_furnizori,
        total_angajati: dateacasa.data.total_angajati,
        suma_profit: dateacasa.data.suma_profit,
        suma_vanzare: dateacasa.data.suma_vanzare,
        cerere_client_asteptare: dateacasa.data.cerere_client_asteptare,
        cerere_client_completate: dateacasa.data.cerere_client_completate,
        suma_profit_azi: dateacasa.data.suma_profit_azi,
        suma_vanzare_azi: dateacasa.data.suma_vanzare_azi,
        data_produse_expirate_serializer: dateacasa.data.data_produse_expirate_serializer
      });

      const listadataprofit = [];
      for (let i=0; i < dateacasa.data.diagrama_profit.length; i++) {
          listadataprofit.push({
              x: new Date(dateacasa.data.diagrama_profit[i].data),
              y: dateacasa.data.diagrama_profit[i].suma
          });
      }

      const listadatavanzari = [];
      for (let i=0; i < dateacasa.data.diagrama_vanzari.length; i++) {
          listadatavanzari.push({
              x: new Date(dateacasa.data.diagrama_vanzari[i].data),
              y: dateacasa.data.diagrama_vanzari[i].suma
          });
      }
      
      this.state.DiagramaProfit = {
        culture: "ro",                     // setăm cultura română
        animationEnabled: true,
        title:{
          text: "Total profit"
        },
        axisX: {
          valueFormatString: "DD MMMM YY"       // lună completă în română
        },
        axisY: {
          title: "Profit (în Lei)",
          suffix: " Lei"                  // afișăm sufixul Lei
        },
        data: [{
          yValueFormatString: "#,### Lei",
          xValueFormatString: "DD MM YY",
          type: "spline",
          dataPoints: listadataprofit
        }]
      }

            this.state.DiagramaVanzari = {
        culture: "ro",                     // setăm cultura română
        animationEnabled: true,
        title:{
          text: "Total vanzari"
        },
        axisX: {
          valueFormatString: "DD MMMM YY"       // lună completă în română
        },
        axisY: {
          title: "Vanzari (în Lei)",
          suffix: " Lei"                  // afișăm sufixul Lei
        },
        data: [{
          yValueFormatString: "#,### Lei",
          xValueFormatString: "DD MM YY",
          type: "spline",
          dataPoints: listadatavanzari
        }]
      }
      
      this.setState({});
    }
    render() {
        return (
            <section className="content">
                <div className="container-fluid">
                    <div className="block-header">
                        <h2>Tablou de bord</h2> {/* DASHBOARD tradus */}
                    </div>

                    {/* Widget-uri */}
                    <div className="row clearfix">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-pink hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total cereri</div> {/* NEW TASKS */}
                                    <div className="number count-to" data-from="0" data-to="125" data-speed="15" data-fresh-interval="20">
                                        {this.state.cerere_client}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-cyan hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total vanzari</div> {/* NEW TICKETS */}
                                    <div className="number count-to" data-from="0" data-to="257" data-speed="1000" data-fresh-interval="20">
                                        {this.state.nr_facturi}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-light-green hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total produse</div> {/* NEW COMMENTS */}
                                    <div className="number count-to" data-from="0" data-to="243" data-speed="1000" data-fresh-interval="20">
                                        {this.state.total_produse}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-orange hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total furnizori</div> {/* NEW VISITORS */}
                                    <div className="number count-to" data-from="0" data-to="1225" data-speed="1000" data-fresh-interval="20">
                                        {this.state.total_furnizori}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                                        <div className="row clearfix">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-pink hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total angajati</div> {/* NEW TASKS */}
                                    <div className="number count-to" data-from="0" data-to="125" data-speed="15" data-fresh-interval="20">
                                        {this.state.total_angajati}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-cyan hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total profit</div> {/* NEW TICKETS */}
                                    <div className="number count-to" data-from="0" data-to="257" data-speed="1000" data-fresh-interval="20">
                                        {this.state.suma_profit}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-light-green hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Total suma vanzari</div> {/* NEW COMMENTS */}
                                    <div className="number count-to" data-from="0" data-to="243" data-speed="1000" data-fresh-interval="20">
                                        {this.state.suma_vanzare}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-orange hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Produse care expira curand</div> {/* NEW VISITORS */}
                                    <div className="number count-to" data-from="0" data-to="1225" data-speed="1000" data-fresh-interval="20">
                                        {this.state.data_produse_expirate_serializer}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                                        <div className="row clearfix">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-pink hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Cereri completate</div> {/* NEW TASKS */}
                                    <div className="number count-to" data-from="0" data-to="125" data-speed="15" data-fresh-interval="20">
                                        {this.state.cerere_client_completate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-cyan hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Cereri in asteptare</div> {/* NEW TICKETS */}
                                    <div className="number count-to" data-from="0" data-to="257" data-speed="1000" data-fresh-interval="20">
                                        {this.state.cerere_client_asteptare}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-light-green hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Vanzari zi curenta</div> {/* NEW COMMENTS */}
                                    <div className="number count-to" data-from="0" data-to="243" data-speed="1000" data-fresh-interval="20">
                                        {this.state.suma_vanzare_azi}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="info-box bg-orange hover-expand-effect">
                                <div className="icon">
                                    <i className="material-icons">bookmark</i>
                                </div>
                                <div className="content">
                                    <div className="text">Profit zi curenta</div> {/* NEW VISITORS */}
                                    <div className="number count-to" data-from="0" data-to="1225" data-speed="1000" data-fresh-interval="20">
                                        {this.state.suma_profit_azi}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header">
                  <h2>Diagrama profit</h2>
                </div>
                <div className="body">
            <CanvasJSChart options={this.state.DiagramaProfit} />
            </div>
            </div>
            </div>
            </div>
            {/* Stiluri pentru redimensionare și ascundere watermark */}
                    <div className="row clearfix">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header">
                  <h2>Diagrama vanzari</h2>
                </div>
                <div className="body">
            <CanvasJSChart options={this.state.DiagramaVanzari} />
            </div>
            </div>
            </div>
            </div>
                </div>
            </section>
        );
    }
}

export default ComponentaAcasa;
