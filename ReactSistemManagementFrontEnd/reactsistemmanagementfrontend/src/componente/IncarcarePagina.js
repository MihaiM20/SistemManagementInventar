import React from 'react';

/**
 * IncarcarePagina este componenta care afișează un ecran de încărcare (loader) cu un spinner.
 * Implicit e ascunsă prin stilul inline `display: none`;
 * pentru a afișa loader-ul atunci când aplicatia efectuează o operație de durată.
 */
class IncarcarePagina extends React.Component {
    render() {
        return (
            // Wrapper-ul întregului loader
            // Poți controla vizibilitatea prin modificarea `style.display`
            <div className="page-loader-wrapper" style={{ display: "none" }}>

                {/* Container-ul spinner-ului și mesajului */}
                <div className="loader">

                    {/* Structura preloader-ului (animația spinner) */}
                    <div className="preloader">

                        {/* Layer-ul spinner-ului cu clasa de culoare (pl-red) */}
                        <div className="spinner-layer pl-red">

                            {/* Jumătatea stângă a cercului în mișcare */}
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>

                            {/* Jumătatea dreaptă a cercului în mișcare */}
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>

                        </div>
                    </div>

                    {/* Mesajul afișat sub spinner */}
                    <p>Te rugăm să aștepți...</p>
                </div>
            </div>
        );
    }
}

export default IncarcarePagina;
