import React from "react";
import "./Skills.css";
import SoftwareSkill from "../../components/softwareSkills/SoftwareSkill";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import { Fade } from "react-reveal";
import DataScienceImg from "./DataScienceImg";
import FullStackImg from "./FullStackImg";
import CloudInfraImg from "./CloudInfraImg";
import DesignImg from "./DesignImg";
import MobileDevImg from "./MobileDevImg";

function GetSkillSvg(props) {
  if (props.fileName === "DataScienceImg")
    return <DataScienceImg theme={props.theme} />;
  else if (props.fileName === "FullStackImg")
    return <FullStackImg theme={props.theme} />;
  else if (props.fileName === "CloudInfraImg")
    return <CloudInfraImg theme={props.theme} />;
  else if (props.fileName === "MobileDevImg")
    return <MobileDevImg theme={props.theme} />;
  return <DesignImg theme={props.theme} />;
}

export default function SkillSection(props) {
  const { portfolioData } = usePortfolioData();
  const skills = portfolioData?.skills || { data: [] };
  const theme = props.theme;
  return (
    <div>
      {(skills.data || []).map((skill, i) => {
        return (
          <div key={i} className="skills-main-div">
            <Fade left duration={2000}>
              <div className="skills-image-div">
                {/* <img
                    alt="Ashutosh is Analysing Data"
                    src={require(`../../assets/images/${skill.imagePath}`)}
                  ></img> */}
                <GetSkillSvg fileName={skill.fileName} theme={theme} />
              </div>
            </Fade>

            <div className="skills-text-div">
              <Fade right duration={1000}>
                <h1 className="skills-heading" style={{ color: theme.text }}>
                  {skill.title}
                </h1>
              </Fade>
              <Fade right duration={1500}>
                <SoftwareSkill logos={skill.softwareSkills} />
              </Fade>
              <Fade right duration={2000}>
                <div>
                  {skill.skills.map((skillSentence, i) => {
                    return (
                      <p
                        key={i}
                        className="subTitle skills-text"
                        style={{ color: theme.secondaryText }}
                      >
                        {skillSentence}
                      </p>
                    );
                  })}
                </div>
              </Fade>
            </div>
          </div>
        );
      })}
    </div>
  );
}
