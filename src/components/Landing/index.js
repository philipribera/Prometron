import React from 'react';
//import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import LocTwo from '../GeolocatedTwo';
import Styled from 'styled-components';

/*** STYLED COMPONENTS ***/

const StyledFlexForm = Styled.div`
    flex-basis: 70%;
    @media (max-width: 768px) {
      flex-basis: 100%;
    }
`;
const StyledMap = Styled.div`
    position: relative;
    z-index: 9999;
    flex-basis: 59%;
    border: 2px solid rgb(252,252,252);
    @media (max-width: 768px) {
    flex-basis: 100%;   
}
`;


const Landing = () => (
    <StyledFlexForm>
        <h1>Landing</h1>
        <br />
        <StyledMap>
            <LocTwo />            
        </StyledMap>
    </StyledFlexForm>
);

export default Landing;