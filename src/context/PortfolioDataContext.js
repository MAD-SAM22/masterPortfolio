/**
 * Portfolio Data Context - fetches data from SQLite API, falls back to static portfolio.js
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import * as portfolio from "../portfolio";

const PortfolioDataContext = createContext(null);

const API_BASE = "";

function usePortfolioFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`${API_BASE}/api/portfolio`, { signal: controller.signal })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("API not available"))
      )
      .then((apiData) => {
        if (!cancelled) {
          setData(apiData);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData(null);
          setError(err);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}

function buildFromApi(api) {
  if (!api) return null;
  const home = api.home;
  const socialLinks = api.socialLinks;
  const skillsData = api.skills;
  const degrees = api.degrees;
  const competitiveSites = api.competitiveSites;
  const certificates = api.certificates;
  const experienceRows = api.experience;
  const experienceMeta = api.experienceMeta;
  const projects = api.projects;
  const projectsHeader = api.projectsHeader;
  const contactData = api.contactData;

  const hasData =
    home ||
    (socialLinks && socialLinks.length) ||
    skillsData ||
    (degrees && degrees.length);

  if (!hasData) return null;

  return {
    greeting: home
      ? {
          title: home.title,
          logo_name: home.logo_name,
          nickname: home.nickname,
          subTitle: home.subTitle,
          resumeLink: home.resumeLink,
          portfolio_repository: home.portfolio_repository,
          githubProfile: home.githubProfile,
        }
      : portfolio.greeting,
    socialMediaLinks:
      socialLinks && socialLinks.length
        ? socialLinks.map((s) => ({
            name: s.name,
            link: s.link,
            fontAwesomeIcon: s.fontAwesomeIcon,
            backgroundColor: s.backgroundColor,
          }))
        : portfolio.socialMediaLinks,
    skills: skillsData && skillsData.data ? skillsData : portfolio.skills,
    degrees: {
      degrees: (degrees || portfolio.degrees.degrees || []).map((d) => {
        const dg = typeof d === "object" && d ? d : {};
        const imgPath = dg.logo_path || dg.image;
        const isUrl =
          imgPath && (imgPath.startsWith("/") || imgPath.startsWith("http"));
        return {
          ...dg,
          logo_path: isUrl ? null : imgPath,
          logo_url: isUrl ? imgPath : null,
        };
      }),
    },
    competitiveSites: {
      competitiveSites:
        competitiveSites || portfolio.competitiveSites.competitiveSites,
    },
    certifications: {
      certifications:
        certificates && certificates.length
          ? certificates.map((c) => {
              const imgPath = c.logo_path || c.image;
              const isUrl =
                imgPath &&
                (imgPath.startsWith("/") || imgPath.startsWith("http"));
              return {
                title: c.title,
                subtitle: c.subtitle
                  ? c.subtitle.startsWith("-")
                    ? c.subtitle
                    : `- ${c.subtitle}`
                  : c.issuer
                  ? `- ${c.issuer}`
                  : "",
                logo_path: isUrl ? null : imgPath,
                logo_url: isUrl ? imgPath : null,
                certificate_link: c.certificate_link || c.url,
                alt_name: c.alt_name || c.title,
                color_code: c.color_code || "#333",
              };
            })
          : portfolio.certifications.certifications,
    },
    experience:
      experienceRows && experienceRows.length
        ? (() => {
            const bySection = { work: [], internship: [], volunteer: [] };
            experienceRows.forEach((ex) => {
              const imgPath = ex.logo_path || ex.image;
              const isUrl =
                imgPath &&
                (imgPath.startsWith("/") || imgPath.startsWith("http"));
              const item = {
                title: ex.title || ex.role,
                company: ex.company,
                company_url: ex.company_url || "#",
                logo_path: isUrl ? null : imgPath || "default_exp.png",
                logo_url: isUrl ? imgPath : null,
                duration:
                  ex.duration || `${ex.start || ""} - ${ex.end || ""}`.trim(),
                location: ex.location || "",
                description: ex.description,
                color: ex.color || "#000",
              };
              const stRaw = (ex.section_type || "work").toLowerCase();
              let st = stRaw;
              if (
                stRaw === "volunteer" ||
                stRaw === "volunteering" ||
                stRaw === "volunteership" ||
                stRaw === "volunteerships"
              )
                st = "volunteer";
              if (stRaw === "internships") st = "internship";

              if (bySection[st]) bySection[st].push(item);
              else bySection.work.push(item);
            });
            const meta = experienceMeta || {};
            return {
              title: meta.title || portfolio.experience.title,
              subtitle: meta.subtitle || portfolio.experience.subtitle,
              description: meta.description || portfolio.experience.description,
              header_image_path: "experience.svg",
              sections: [
                { title: "Work", work: true, experiences: bySection.work },
                { title: "Internships", experiences: bySection.internship },
                { title: "Volunteerships", experiences: bySection.volunteer },
              ].filter((s) => s.experiences && s.experiences.length),
            };
          })()
        : portfolio.experience,
    projectsHeader: projectsHeader
      ? {
          title: projectsHeader.title,
          description: projectsHeader.description,
          avatar_image_path: projectsHeader.avatar_image_path,
        }
      : portfolio.projectsHeader,
    projectsData:
      projects && projects.length
        ? {
            data: projects.map((p) => {
              const langs =
                typeof p.languages === "string"
                  ? (() => {
                      try {
                        return JSON.parse(p.languages);
                      } catch {
                        return [];
                      }
                    })()
                  : p.languages || [];
              return {
                id: `proj-${p.id}`,
                name: p.name,
                description: p.description,
                createdAt: p.year
                  ? `${p.year}-01-01T00:00:00Z`
                  : "2024-01-01T00:00:00Z",
                url: p.url || "#",
                languages: Array.isArray(langs)
                  ? langs.map((l) => ({
                      name: l.name || l,
                      iconifyClass:
                        (l && l.iconifyClass) ||
                        (l && l.iconifyClassname) ||
                        `logos-${((l && l.name) || l || "").toLowerCase()}`,
                    }))
                  : [],
              };
            }),
          }
        : null,
    contactPageData:
      contactData && Object.keys(contactData).length
        ? contactData
        : portfolio.contactPageData,
    publications:
      api.research && api.research.length
        ? { data: api.research }
        : portfolio.publications,
    publicationsHeader: portfolio.publicationsHeader,
  };
}

function getFallback() {
  return {
    greeting: portfolio.greeting,
    socialMediaLinks: portfolio.socialMediaLinks,
    skills: portfolio.skills,
    degrees: portfolio.degrees,
    competitiveSites: portfolio.competitiveSites,
    certifications: portfolio.certifications,
    experience: portfolio.experience,
    projectsHeader: portfolio.projectsHeader,
    projectsData: null,
    contactPageData: portfolio.contactPageData,
    publications: portfolio.publications,
    publicationsHeader: portfolio.publicationsHeader,
  };
}

export function PortfolioDataProvider({ children }) {
  const { data: apiData, loading, error } = usePortfolioFetch();
  const [portfolioData, setPortfolioData] = useState(() => getFallback());

  useEffect(() => {
    const built = buildFromApi(apiData);
    setPortfolioData(built || getFallback());
  }, [apiData]);

  const value = {
    portfolioData,
    loading,
    error,
    useApi: !!apiData && !error,
    refresh: () => window.location.reload(),
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    return {
      portfolioData: {
        greeting: portfolio.greeting,
        socialMediaLinks: portfolio.socialMediaLinks,
        skills: portfolio.skills,
        degrees: portfolio.degrees,
        competitiveSites: portfolio.competitiveSites,
        certifications: portfolio.certifications,
        experience: portfolio.experience,
        projectsHeader: portfolio.projectsHeader,
        projectsData: null,
        contactPageData: portfolio.contactPageData,
        publications: portfolio.publications,
        publicationsHeader: portfolio.publicationsHeader,
      },
      loading: false,
      useApi: false,
    };
  }
  return ctx;
}
