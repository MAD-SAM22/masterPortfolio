import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef(null);
  const touchDeltaRef = useRef(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    let found = null;
    if (type === "project") {
      const projects = portfolioData.projectsData?.data || [];
      found = projects.find(
        (p) =>
          String(p.id) === String(id) || String(p.id) === String(`proj-${id}`)
      );
      if (found) found = { ...found, type: "project" };
    } else if (type === "publication") {
      const pubs = portfolioData.publications?.data || [];
      found = pubs.find(
        (p) =>
          String(p.id) === String(id) || String(p.id) === String(parseInt(id))
      );
      if (found) found = { ...found, type: "publication" };
    }

    if (found) {
      setItem(found);
      setNotFound(false);
    } else if (portfolioData.projectsData || portfolioData.publications) {
      setItem(null);
      setNotFound(true);
    }
    setCurrentSlide(0);
  }, [type, id, portfolioData]);

  const goBack = () => history.push("/projects");

  const getImages = () => {
    if (!item) return [];
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    if (item.image) return [item.image];
    return [];
  };

  const images = getImages();
  const totalImages = images.length;

  const goToSlide = useCallback(
    (index) => {
      if (totalImages <= 1) return;
      if (index < 0) index = totalImages - 1;
      if (index >= totalImages) index = 0;
      setCurrentSlide(index);
    },
    [totalImages]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
      if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, goToSlide]);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartRef.current === null) return;
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
  };

  const handleTouchEnd = () => {
    const delta = touchDeltaRef.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goToSlide(currentSlide - 1);
      else goToSlide(currentSlide + 1);
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
  };

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

  const dateStr = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const description = item?.description || item?.content || "";
  const isHtml = description.includes("<") && description.includes(">");
  const descriptionParagraphs = isHtml
    ? []
    : description.split("\n\n").filter(Boolean);

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

  return (
    <div className="project-blog-page" style={{ backgroundColor: theme.body }}>
      <Header theme={theme} />
      {item ? (
        <article className="blog-article">
          {/* Header */}
          <div className="blog-header-section">
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
              {dateStr && (
                <span
                  className="blog-meta-dot"
                  style={{ color: theme.secondaryText }}
                />
              )}
              {item.type === "project" ? "Project" : "Research"}
            </p>
          </div>

          {/* Image Gallery */}
          {totalImages > 0 && (
            <div className="blog-gallery" ref={galleryRef}>
              <div
                className="blog-gallery-viewport"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {images.map((imgPath, idx) => (
                  <div key={idx} className="blog-gallery-slide">
                    <img
                      src={getImageSrc(imgPath)}
                      alt=""
                      className="blog-gallery-image"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {totalImages > 1 && (
                <>
                  <button
                    className="blog-gallery-arrow blog-gallery-arrow--prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(currentSlide - 1);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    ‹
                  </button>
                  <button
                    className="blog-gallery-arrow blog-gallery-arrow--next"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(currentSlide + 1);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    ›
                  </button>

                  <div className="blog-gallery-counter">
                    {currentSlide + 1} / {totalImages}
                  </div>

                  <div className="blog-gallery-dots">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        className={`blog-gallery-dot ${
                          idx === currentSlide ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToSlide(idx);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
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
                    Star on GitHub
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
                    {item.type === "publication"
                      ? "Read Paper"
                      : "View Project"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div style={{ minHeight: "60vh" }} />
      )}
      <Footer theme={theme} />
      <TopButton theme={theme} />
    </div>
  );
}
