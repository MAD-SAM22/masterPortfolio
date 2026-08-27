import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import TopButton from "../../components/topButton/TopButton";
import Educations from "../../containers/education/Educations";
import Certifications from "../../containers/certifications/Certifications";
import CompetitiveSites from "../../components/competitiveSites/CompetitiveSites";
import EducationImg from "./EducationImg";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import "./EducationComponent.css";
import { Fade } from "react-reveal";

function EducationInner(props) {
  const { portfolioData } = usePortfolioData();
  const competitiveSites = portfolioData?.competitiveSites || {
    competitiveSites: [],
  };
  const certifications = portfolioData?.certifications || {
    certifications: [],
  };
  const theme = props.theme;
  return (
    <div className="education-main">
      <Header theme={props.theme} />
      <div className="basic-education">
        <Fade bottom duration={2000} distance="40px">
          <div className="heading-div">
            <div className="heading-img-div">
              <EducationImg theme={theme} />
            </div>
            <div className="heading-text-div">
              <h1 className="heading-text" style={{ color: theme.text }}>
                Education
              </h1>
              <h3 className="heading-sub-text" style={{ color: theme.text }}>
                Basic Qualification and Certifcations
              </h3>
              <CompetitiveSites
                logos={competitiveSites.competitiveSites || []}
              />
            </div>
          </div>
        </Fade>
        <Educations theme={props.theme} />
        {certifications.certifications &&
        certifications.certifications.length > 0 ? (
          <Certifications theme={props.theme} />
        ) : null}
      </div>
      <Footer theme={props.theme} />
      <TopButton theme={props.theme} />
    </div>
  );
}

export default function Education(props) {
  return <EducationInner {...props} />;
}
