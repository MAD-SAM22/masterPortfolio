import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import GithubRepoCard from "../../components/githubRepoCard/GithubRepoCard";
import PublicationCard from "../../components/publicationsCard/PublicationCard";
import Button from "../../components/button/Button";
import TopButton from "../../components/topButton/TopButton";
import { Fade } from "react-reveal";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import {
  publications as pubFallback,
  publicationsHeader as pubHeaderFallback,
} from "../../portfolio.js";
import "./Projects.css";
import ProjectsImg from "./ProjectsImg";

export default function Projects(props) {
  const { portfolioData } = usePortfolioData();
  const theme = props.theme;
  const projectsHeader = portfolioData?.projectsHeader || {
    title: "Projects",
    description: "",
  };
  const projectsData = portfolioData?.projectsData;
  const greeting = portfolioData?.greeting || { githubProfile: "#" };
  const pubHeader = portfolioData?.publicationsHeader || pubHeaderFallback;
  const publications = portfolioData?.publications || pubFallback;
  const projects = projectsData?.data || [];
  return (
    <div className="projects-main">
      <Header theme={theme} />
      <div className="basic-projects">
        <Fade bottom duration={2000} distance="40px">
          <div className="projects-heading-div">
            <div className="projects-heading-img-div">
              <ProjectsImg theme={theme} />
            </div>
            <div className="projects-heading-text-div">
              <h1
                className="projects-heading-text"
                style={{ color: theme.text }}
              >
                {projectsHeader.title}
              </h1>
              <p
                className="projects-header-detail-text subTitle"
                style={{ color: theme.secondaryText }}
              >
                {projectsHeader.description}
              </p>
            </div>
          </div>
        </Fade>
      </div>
      <div className="repo-cards-div-main">
        {projects.map((repo) => (
          <GithubRepoCard
            key={repo.id || repo.name}
            repo={repo}
            theme={theme}
          />
        ))}
      </div>
      <Button
        text={"More Projects"}
        className="project-button"
        href={greeting.githubProfile}
        newTab={true}
        theme={theme}
      />

      {/* Publications  */}
      {publications?.data && publications.data.length > 0 ? (
        <div className="basic-projects">
          <Fade bottom duration={2000} distance="40px">
            <div className="publications-heading-div">
              <div className="publications-heading-text-div">
                <h1
                  className="publications-heading-text"
                  style={{ color: theme.text }}
                >
                  {pubHeader?.title || "Publications"}
                </h1>
                <p
                  className="projects-header-detail-text subTitle"
                  style={{ color: theme.secondaryText }}
                >
                  {pubHeader?.description || ""}
                </p>
              </div>
            </div>
          </Fade>
        </div>
      ) : null}

      <div className="repo-cards-div-main">
        {(publications?.data || []).map((pub) => (
          <PublicationCard key={pub.id} pub={pub} theme={theme} />
        ))}
      </div>

      <Footer theme={props.theme} onToggle={props.onToggle} />
      <TopButton theme={props.theme} />
    </div>
  );
}
