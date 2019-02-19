import React from 'react';
//import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import LocTwo from '../GeolocatedTwo';
import Styled from 'styled-components';

const StyledMap = Styled.div`
    flex-basis: 59%;
    border: 2px solid rgb(252,252,252);
    @media (max-width: 768px) {
      flex-basis: 100%;
    }
`;

const Landing = () => (
    <div>
        <h1>Landing</h1>
        <br />
        <StyledMap className="map-container">
        <LocTwo />        
        </StyledMap>

    </div>
);

export default Landing;