import React from "react";
import "./Footer.css";
import { Fade } from "react-reveal";
import { usePortfolioData } from "../../context/PortfolioDataContext";
/* eslint-disable jsx-a11y/accessible-emoji */

export default function Footer(props) {
  const { portfolioData } = usePortfolioData();
  const greeting = portfolioData?.greeting || { title: "Portfolio" };
  return (
    <div className="footer-div">
      <Fade>
        <p className="footer-text" style={{ color: props.theme.secondaryText }}>
          Made with <span role="img">❤️</span> by {greeting.title}
        </p>
        {/* <ToggleSwitch theme={props.theme} onToggle={props.onToggle}/> */}
      </Fade>
    </div>
  );
}
