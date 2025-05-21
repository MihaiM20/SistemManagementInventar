import React from 'react';

/**
 * Overlay este componenta care afișează un fundal semitransparent
 * peste întreaga pagină pentru a evidenția meniul lateral deschis
 * sau moduri de dialog/modal.
 *
 * Props:
 *  - display (boolean): dacă e true, overlay-ul este vizibil (display: block);
 *                       altfel, este ascuns (display: none).
 */
class Overlay extends React.Component {
    render() {
        return (
            <div
                className="overlay"
                style={{
                    // Controlăm vizibilitatea prin inline style
                    display: this.props.display ? 'block' : 'none'
                }}
            />
        );
    }
}

export default Overlay;
