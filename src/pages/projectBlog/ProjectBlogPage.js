import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import TopButton from "../../components/topButton/TopButton";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import "./ProjectBlogPage.css";

export default function ProjectBlogPage(props) {
  const { type, id } = useParams();
  const history = useHistory();
  const theme = props.theme;
  const { portfolioData } = usePortfolioData();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let found = null;
    if (type === "project") {
      found = (portfolioData.projectsData?.data || []).find(
        (p) => p.id === id || p.id === `proj-${id}`
      );
      if (found) found = { ...found, type: "project" };
    } else if (type === "publication") {
      found = (portfolioData.publications?.data || []).find(
        (p) => p.id === id || p.id === parseInt(id)
      );
      if (found) found = { ...found, type: "publication" };
    }

    if (found) {
      setItem(found);
      setNotFound(false);
    } else {
      setItem(null);
      setNotFound(true);
    }
  }, [type, id, portfolioData]);

  const goBack = () => history.push("/projects");

  if (notFound && !item) {
    return (
      <div
        className="project-blog-page"
        style={{ backgroundColor: theme.body }}
      >
        <Header theme={theme} />
        <div className="blog-not-found">
          <h1 style={{ color: theme.text }}>Article not found</h1>
          <button
            className="blog-back-btn"
            onClick={goBack}
            style={{
              backgroundColor: theme.imageHighlight,
              color: theme.body,
            }}
          >
            Back to Projects
          </button>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  if (!item) return null;

  const getImageSrc = (path) => {
    if (!path) return null;
    if (
      path.startsWith("http") ||
      path.startsWith("/") ||
      path.startsWith("data:")
    ) {
      return path;
    }
    try {
      return require(`../../assets/images/${path}`);
    } catch (e) {
      return path;
    }
  };

  const images =
    item.images || (item.image ? [item.image] : ["projects_image.svg"]);
  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const description = item.description || item.content || "";
  const isHtml = description.includes("<") && description.includes(">");
  const descriptionParagraphs = isHtml
    ? []
    : description.split("\n\n").filter(Boolean);

  return (
    <div className="project-blog-page" style={{ backgroundColor: theme.body }}>
      <Header theme={theme} />
      <article className="blog-article">
        <header className="blog-header">
          <button
            className="blog-back-link"
            onClick={goBack}
            style={{ color: theme.secondaryText }}
          >
            ← Back to Projects
          </button>
          <h1 className="blog-title" style={{ color: theme.text }}>
            {item.name}
          </h1>
          <p className="blog-meta" style={{ color: theme.secondaryText }}>
            {dateStr}
            {item.type === "project" ? " • Project" : " • Research"}
          </p>
        </header>

        <div className="blog-hero">
          <img
            src={getImageSrc(images[0])}
            alt={item.name}
            className="blog-hero-image"
          />
        </div>

        <div className="blog-content">
          <div className="blog-body">
            {isHtml ? (
              <div
                className="blog-html-content"
                style={{ color: theme.text }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              descriptionParagraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="blog-paragraph"
                  style={{ color: theme.text }}
                >
                  {para}
                </p>
              ))
            )}

            {images.length > 1 && (
              <div className="blog-images-grid">
                {images.slice(1).map((imgPath, idx) => (
                  <figure key={idx} className="blog-figure">
                    <img
                      src={getImageSrc(imgPath)}
                      alt={`${item.name} - ${idx + 2}`}
                      className="blog-content-image"
                    />
                  </figure>
                ))}
              </div>
            )}

            <div className="blog-actions">
              {item.type === "project" && item.repoUrl && (
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-star-btn"
                  style={{
                    backgroundColor: theme.imageHighlight,
                    color: theme.body,
                  }}
                >
                  ⭐ Star on GitHub
                </a>
              )}
              {(item.type === "publication" || item.url) && item.url !== "#" && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-read-btn"
                  style={{
                    backgroundColor: theme.imageHighlight,
                    color: theme.body,
                  }}
                >
                  {item.type === "publication" ? "Read Paper" : "View Project"}
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
      <Footer theme={theme} />
      <TopButton theme={theme} />
    </div>
  );
}
