import React from "react";
import "./Educations.css";
import DegreeCard from "../../components/degreeCard/DegreeCard.js";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import { Fade } from "react-reveal";

export default function Educations(props) {
  const { portfolioData } = usePortfolioData();
  const degrees = portfolioData?.degrees || { degrees: [] };
  const theme = props.theme;
  return (
    <div className="main" id="educations">
      <div className="educations-header-div">
        <Fade bottom duration={2000} distance="20px">
          <h1 className="educations-header" style={{ color: theme.text }}>
            Degrees Received
          </h1>
        </Fade>
      </div>
      <div className="educations-body-div">
        {(degrees.degrees || []).map((degree) => {
          return <DegreeCard degree={degree} theme={theme} />;
        })}
      </div>
    </div>
  );
}
