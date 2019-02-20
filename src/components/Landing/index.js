import React from "react";

import Img from "../../images/landingBg_980.jpg";
import LocTwo from "../GeolocatedTwo";
import Styled from "styled-components";



/*** STYLED COMPONENTS ***/
const StyledFlexDiv = Styled.div`
    display: flex;
    width: 100%;
    height: auto;
    min-height: 500px;
    background-image: url( ${Img} );  
    background-repeat: no-repeat;
		background-position: center;	
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;		
    padding: 22px;
    @media (max-width: 768px) {
      flex-basis: 100%;
    }
`;

const StyledH1 = Styled.h1`
    font-family: open_sansregular, sans-serif;
    letter-spacing: -0.05em;
    font-size: 2.7em;
    color: rgb(252, 252, 252);
    text-shadow: rgb(15, 15, 15) 0.5px 1.5px 0.5px;  
    padding: 22px;
    margin: auto;
    border: 2px solid rgb(222,222,222);
    border-radius: 5%;
    cursor: pointer;
    background: rgb(239, 152, 44);
`;

const StyledEnter = Styled.div`
    display: flex;    
    justify-content: center;
    opacity: 0.9;
`;

const StyledH2 = Styled.h2`
    font-family: Geneva, Verdana, sans-serif;
    letter-spacing: -0.05em;
    font-size: 2.05em;
    font-style: oblique;
    color: rgb(255, 183, 77);
    text-shadow: rgb(57, 57, 57) 1px 1px 0.5px;    
`;


const Landing = () => (
    <StyledFlexDiv>
      <StyledH1>ENTER</StyledH1>
    </StyledFlexDiv>
);

export default Landing;
