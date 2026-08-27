/**
 * Standalone seed script - reads from portfolio-seed.json.
 * To seed: Use the "Seed from portfolio.js" button in Admin Dashboard at /admin (recommended).
 * The button imports portfolio.js from the React app and POSTs to /api/seed.
 *
 * Alternatively, create portfolio-seed.json and run: node server/seed-portfolio.js
 */
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

let portfolio;
const jsonPath = path.join(__dirname, "portfolio-seed.json");
if (fs.existsSync(jsonPath)) {
  portfolio = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log("Loaded portfolio from portfolio-seed.json");
} else {
  console.log("portfolio-seed.json not found.");
  console.log(
    'RECOMMENDED: Use the "Seed from portfolio.js" button in Admin Dashboard at /admin'
  );
  console.log("That will seed the database from your src/portfolio.js file.");
  process.exit(1);
}

const db = new sqlite3.Database("./portfolio.db");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seed() {
  try {
    // Home
    const g = portfolio.greeting;
    await run(
      `INSERT OR REPLACE INTO home (id, title, logo_name, nickname, subTitle, resumeLink, portfolio_repository, githubProfile) 
       VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.title,
        g.logo_name,
        g.nickname,
        g.subTitle,
        g.resumeLink,
        g.portfolio_repository,
        g.githubProfile,
      ]
    );
    console.log("Seeded home");

    // Social links
    await run("DELETE FROM social_links");
    for (let i = 0; i < portfolio.socialMediaLinks.length; i++) {
      const s = portfolio.socialMediaLinks[i];
      await run(
        "INSERT INTO social_links (name, link, fontAwesomeIcon, backgroundColor, sort_order) VALUES (?, ?, ?, ?, ?)",
        [s.name, s.link, s.fontAwesomeIcon, s.backgroundColor || "#333", i]
      );
    }
    console.log("Seeded social_links");

    // Skills
    await run("INSERT OR REPLACE INTO skills (id, data) VALUES (1, ?)", [
      JSON.stringify(portfolio.skills),
    ]);
    console.log("Seeded skills");

    // Degrees
    await run("DELETE FROM degrees");
    for (const d of portfolio.degrees.degrees) {
      await run(
        "INSERT INTO degrees (title, subtitle, logo_path, alt_name, duration, descriptions, website_link) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          d.title,
          d.subtitle,
          d.logo_path,
          d.alt_name,
          d.duration,
          JSON.stringify(d.descriptions || []),
          d.website_link,
        ]
      );
    }
    console.log("Seeded degrees");

    // Competitive sites
    await run("DELETE FROM competitive_sites");
    for (
      let i = 0;
      i < portfolio.competitiveSites.competitiveSites.length;
      i++
    ) {
      const c = portfolio.competitiveSites.competitiveSites[i];
      await run(
        "INSERT INTO competitive_sites (siteName, iconifyClassname, style, profileLink, sort_order) VALUES (?, ?, ?, ?, ?)",
        [
          c.siteName,
          c.iconifyClassname,
          JSON.stringify(c.style || {}),
          c.profileLink,
          i,
        ]
      );
    }
    console.log("Seeded competitive_sites");

    // Certifications -> certificates
    await run("DELETE FROM certificates");
    for (const c of portfolio.certifications.certifications) {
      await run(
        "INSERT INTO certificates (title, issuer, subtitle, logo_path, url, certificate_link, alt_name, color_code, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          c.title,
          c.subtitle?.replace(/^- /, "") || "",
          c.subtitle,
          c.logo_path,
          c.certificate_link,
          c.certificate_link,
          c.alt_name,
          c.color_code || "",
          "",
        ]
      );
    }
    console.log("Seeded certificates");

    // Experience
    await run("DELETE FROM experience");
    const sectionTypes = {
      Work: "work",
      Internships: "internship",
      Volunteerships: "volunteer",
    };
    for (const section of portfolio.experience.sections) {
      const st = sectionTypes[section.title] || "work";
      for (const ex of section.experiences || []) {
        await run(
          `INSERT INTO experience (role, title, company, company_url, duration, location, description, logo_path, section_type, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ex.title,
            ex.title,
            ex.company,
            ex.company_url || "",
            ex.duration || "",
            ex.location || "",
            ex.description || "",
            ex.logo_path || "",
            st,
            ex.color || "#000",
          ]
        );
      }
    }
    console.log("Seeded experience");

    // Experience meta
    await run(
      `INSERT OR REPLACE INTO experience_meta (id, title, subtitle, description) VALUES (1, ?, ?, ?)`,
      [
        portfolio.experience.title,
        portfolio.experience.subtitle,
        portfolio.experience.description,
      ]
    );
    console.log("Seeded experience_meta");

    // Projects header
    await run(
      `INSERT OR REPLACE INTO projects_header (id, title, description, avatar_image_path) VALUES (1, ?, ?, ?)`,
      [
        portfolio.projectsHeader.title,
        portfolio.projectsHeader.description,
        portfolio.projectsHeader.avatar_image_path,
      ]
    );
    console.log("Seeded projects_header");

    // Contact data
    await run(
      `INSERT OR REPLACE INTO contact_data (id, contact_section, blog_section, address_section, phone_section) VALUES (1, ?, ?, ?, ?)`,
      [
        JSON.stringify(portfolio.contactPageData.contactSection),
        JSON.stringify(portfolio.contactPageData.blogSection),
        JSON.stringify(portfolio.contactPageData.addressSection),
        JSON.stringify(portfolio.contactPageData.phoneSection || {}),
      ]
    );
    console.log("Seeded contact_data");

    // Projects - merge with existing or seed from projects.json if empty
    const projectsJson = require("../src/shared/opensource/projects.json");
    const countRes = await new Promise((res, rej) =>
      db.get("SELECT COUNT(*) as c FROM projects", (e, r) =>
        e ? rej(e) : res(r)
      )
    );
    if (countRes.c === 0 && projectsJson.data) {
      await run("DELETE FROM projects");
      for (const p of projectsJson.data) {
        const year = p.createdAt
          ? new Date(p.createdAt).getFullYear().toString()
          : "";
        const langs = (p.languages || []).map((l) => ({
          name: l.name,
          iconifyClass: l.iconifyClass,
        }));
        await run(
          "INSERT INTO projects (name, description, year, url, technologies, languages) VALUES (?, ?, ?, ?, ?, ?)",
          [
            p.name,
            p.description,
            year,
            p.url || "#",
            JSON.stringify(langs),
            JSON.stringify(langs),
          ]
        );
      }
      console.log("Seeded projects from projects.json");
    }
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    db.close();
  }
}

seed();
