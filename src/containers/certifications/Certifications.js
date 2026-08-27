import React from "react";
import "./Certifications.css";
import { Fade } from "react-reveal";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import CertificationCard from "../../components/certificationCard/CertificationCard";

export default function Certifications(props) {
  const { portfolioData } = usePortfolioData();
  const certifications = portfolioData?.certifications || {
    certifications: [],
  };
  const theme = props.theme;
  return (
    <div className="main" id="certs">
      <div className="certs-header-div">
        <Fade bottom duration={2000} distance="20px">
          <h1 className="certs-header" style={{ color: theme.text }}>
            Certifications
          </h1>
        </Fade>
      </div>
      <div className="certs-body-div">
        {(certifications.certifications || []).map((cert) => {
          return <CertificationCard certificate={cert} theme={theme} />;
        })}
      </div>
    </div>
  );
}
