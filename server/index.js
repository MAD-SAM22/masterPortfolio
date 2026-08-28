// Express server for portfolio admin dashboard and API
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "admin123").trim();

// SQLite DB setup
const db = new sqlite3.Database("./portfolio.db");

// File upload setup
// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware: try uploading with one field name, fallback to another
function uploadEither(nameA, nameB) {
  return (req, res, next) => {
    upload.single(nameA)(req, res, (err) => {
      if (err) {
        upload.single(nameB)(req, res, next);
      } else {
        next();
      }
    });
  };
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Simple admin auth middleware
function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"] || req.body.adminToken;
  if (token === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// DB schema init
const initSql = `
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  year TEXT,
  url TEXT,
  image TEXT,
  technologies TEXT,
  languages TEXT,
  content TEXT
);
CREATE TABLE IF NOT EXISTS research (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  abstract TEXT,
  date TEXT,
  url TEXT,
  image TEXT,
  content TEXT
);
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  issuer TEXT,
  subtitle TEXT,
  date TEXT,
  image TEXT,
  logo_path TEXT,
  url TEXT,
  certificate_link TEXT,
  description TEXT,
  alt_name TEXT,
  color_code TEXT
);
CREATE TABLE IF NOT EXISTS experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT,
  title TEXT,
  company TEXT,
  company_url TEXT,
  start TEXT,
  end TEXT,
  duration TEXT,
  location TEXT,
  description TEXT,
  image TEXT,
  logo_path TEXT,
  section_type TEXT,
  color TEXT
);
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  type TEXT,
  alt TEXT
);
CREATE TABLE IF NOT EXISTS site_details (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bio TEXT,
  skills TEXT,
  contact TEXT
);
CREATE TABLE IF NOT EXISTS home (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT,
  logo_name TEXT,
  nickname TEXT,
  subTitle TEXT,
  resumeLink TEXT,
  portfolio_repository TEXT,
  githubProfile TEXT
);
CREATE TABLE IF NOT EXISTS social_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  link TEXT,
  fontAwesomeIcon TEXT,
  backgroundColor TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT
);
CREATE TABLE IF NOT EXISTS degrees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  subtitle TEXT,
  logo_path TEXT,
  alt_name TEXT,
  duration TEXT,
  descriptions TEXT,
  website_link TEXT
);
CREATE TABLE IF NOT EXISTS competitive_sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteName TEXT,
  iconifyClassname TEXT,
  style TEXT,
  profileLink TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS experience_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT,
  subtitle TEXT,
  description TEXT
);
CREATE TABLE IF NOT EXISTS projects_header (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT,
  description TEXT,
  avatar_image_path TEXT
);
CREATE TABLE IF NOT EXISTS contact_data (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  contact_section TEXT,
  blog_section TEXT,
  address_section TEXT,
  phone_section TEXT
);
`;
db.exec(initSql);

// Add new columns to existing tables if missing (ignore if already exist)
const alterCols = [
  "ALTER TABLE projects ADD COLUMN languages TEXT",
  "ALTER TABLE certificates ADD COLUMN subtitle TEXT",
  "ALTER TABLE certificates ADD COLUMN logo_path TEXT",
  "ALTER TABLE certificates ADD COLUMN certificate_link TEXT",
  "ALTER TABLE certificates ADD COLUMN alt_name TEXT",
  "ALTER TABLE certificates ADD COLUMN color_code TEXT",
  "ALTER TABLE experience ADD COLUMN title TEXT",
  "ALTER TABLE experience ADD COLUMN company_url TEXT",
  "ALTER TABLE experience ADD COLUMN duration TEXT",
  "ALTER TABLE experience ADD COLUMN location TEXT",
  "ALTER TABLE experience ADD COLUMN logo_path TEXT",
  "ALTER TABLE experience ADD COLUMN section_type TEXT",
  "ALTER TABLE experience ADD COLUMN color TEXT",
];
alterCols.forEach((sql) => {
  db.run(sql, () => {});
});

// API: Get all projects
app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows = rows.map((r) => {
      if (r.image) {
        try {
          const parsed = JSON.parse(r.image);
          r.images = Array.isArray(parsed) ? parsed : [r.image];
        } catch {
          r.images = [r.image];
        }
      } else {
        r.images = [];
      }
      return r;
    });
    res.json(rows);
  });
});

// API: Add project
app.post("/api/projects", adminAuth, upload.array("images", 10), (req, res) => {
  const {
    name,
    description,
    year,
    url,
    technologies,
    languages,
    existingImages,
  } = req.body;
  const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
  let existing = [];
  if (existingImages) {
    try {
      existing = JSON.parse(existingImages);
    } catch {}
  }
  const allImages = [...existing, ...newImages];
  const imageStr = allImages.length > 0 ? JSON.stringify(allImages) : null;
  const langStr =
    typeof languages === "string"
      ? languages
      : languages
      ? JSON.stringify(languages)
      : null;
  db.run(
    "INSERT INTO projects (name, description, year, url, image, technologies, languages) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, description, year, url, imageStr, technologies, langStr],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// API: Update project
app.put(
  "/api/projects/:id",
  adminAuth,
  upload.array("images", 10),
  (req, res) => {
    const {
      name,
      description,
      year,
      url,
      technologies,
      languages,
      existingImages,
    } = req.body;
    const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    let existing = [];
    if (existingImages) {
      try {
        existing = JSON.parse(existingImages);
      } catch {}
    }
    const allImages = [...existing, ...newImages];
    const imageStr = allImages.length > 0 ? JSON.stringify(allImages) : null;
    const langStr =
      typeof languages === "string"
        ? languages
        : languages
        ? JSON.stringify(languages)
        : null;
    db.run(
      "UPDATE projects SET name=?, description=?, year=?, url=?, image=?, technologies=?, languages=? WHERE id=?",
      [
        name,
        description,
        year,
        url,
        imageStr,
        technologies,
        langStr,
        req.params.id,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  }
);

// API: Delete project
app.delete("/api/projects/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM projects WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// API: Get single project
app.get("/api/projects/:id", (req, res) => {
  db.get("SELECT * FROM projects WHERE id=?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// API: Get all research
app.get("/api/research", (req, res) => {
  db.all("SELECT * FROM research", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows = rows.map((r) => {
      if (r.image) {
        try {
          const parsed = JSON.parse(r.image);
          r.images = Array.isArray(parsed) ? parsed : [r.image];
        } catch {
          r.images = [r.image];
        }
      } else {
        r.images = [];
      }
      return r;
    });
    res.json(rows);
  });
});

// API: Add research
app.post("/api/research", adminAuth, upload.array("images", 10), (req, res) => {
  const { title, abstract, date, url, content, existingImages } = req.body;
  const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
  let existing = [];
  if (existingImages) {
    try {
      existing = JSON.parse(existingImages);
    } catch {}
  }
  const allImages = [...existing, ...newImages];
  const imageStr = allImages.length > 0 ? JSON.stringify(allImages) : null;
  db.run(
    "INSERT INTO research (title, abstract, date, url, image, content) VALUES (?, ?, ?, ?, ?, ?)",
    [title, abstract, date, url, imageStr, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// API: Update research
app.put(
  "/api/research/:id",
  adminAuth,
  upload.array("images", 10),
  (req, res) => {
    const { title, abstract, date, url, content, existingImages } = req.body;
    const newImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    let existing = [];
    if (existingImages) {
      try {
        existing = JSON.parse(existingImages);
      } catch {}
    }
    const allImages = [...existing, ...newImages];
    const imageStr = allImages.length > 0 ? JSON.stringify(allImages) : null;
    db.run(
      "UPDATE research SET title=?, abstract=?, date=?, url=?, image=?, content=? WHERE id=?",
      [title, abstract, date, url, imageStr, content, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  }
);

// API: Delete research
app.delete("/api/research/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM research WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// API: Get all certificates
app.get("/api/certificates", (req, res) => {
  db.all("SELECT * FROM certificates", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add certificate
app.post(
  "/api/certificates",
  adminAuth,
  uploadEither("image", "logo_path"),
  (req, res) => {
    const {
      title,
      issuer,
      subtitle,
      date,
      url,
      certificate_link,
      description,
      alt_name,
      color_code,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const link = certificate_link || url;
    db.run(
      "INSERT INTO certificates (title, issuer, subtitle, date, url, certificate_link, image, logo_path, description, alt_name, color_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        issuer,
        subtitle,
        date,
        url,
        link,
        image,
        image,
        description,
        alt_name,
        color_code,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  }
);

// API: Update certificate
app.put(
  "/api/certificates/:id",
  adminAuth,
  uploadEither("image", "logo_path"),
  (req, res) => {
    const {
      title,
      issuer,
      subtitle,
      date,
      url,
      certificate_link,
      description,
      alt_name,
      color_code,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const link = certificate_link || url;
    db.run(
      "UPDATE certificates SET title=?, issuer=?, subtitle=?, date=?, url=?, certificate_link=?, image=?, logo_path=?, description=?, alt_name=?, color_code=? WHERE id=?",
      [
        title,
        issuer,
        subtitle,
        date,
        url,
        link,
        image,
        image,
        description,
        alt_name,
        color_code,
        req.params.id,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  }
);

// API: Delete certificate
app.delete("/api/certificates/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM certificates WHERE id=?", [req.params.id], function (
    err
  ) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// API: Get all experience
app.get("/api/experience", (req, res) => {
  db.all("SELECT * FROM experience", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Self-correction for incorrectly categorized volunteering experiences
    const volunteeringKeywords = [
      "tedx",
      "volunteer",
      "delegate",
      "mun",
      "lebaladna",
      "alwan",
    ];
    rows.forEach((row) => {
      if (!row.section_type || row.section_type === "work") {
        const text = `${row.title} ${row.role} ${row.company}`.toLowerCase();
        if (volunteeringKeywords.some((kw) => text.includes(kw))) {
          row.section_type = "volunteer";
        }
      }
    });

    res.json(rows);
  });
});

// API: Add experience
app.post(
  "/api/experience",
  adminAuth,
  uploadEither("image", "logo_path"),
  (req, res) => {
    const {
      role,
      title,
      company,
      company_url,
      start,
      end,
      duration,
      location,
      description,
      section_type,
      color,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const t = title || role;
    const dur = duration || (start && end ? `${start} - ${end}` : start || "");
    db.run(
      "INSERT INTO experience (role, title, company, company_url, start, end, duration, location, description, image, logo_path, section_type, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        t,
        t,
        company,
        company_url,
        start,
        end,
        dur,
        location,
        description,
        image,
        image,
        section_type || "work",
        color,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  }
);

// API: Update experience
app.put(
  "/api/experience/:id",
  adminAuth,
  uploadEither("image", "logo_path"),
  (req, res) => {
    const {
      role,
      title,
      company,
      company_url,
      start,
      end,
      duration,
      location,
      description,
      section_type,
      color,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const t = title || role;
    const dur = duration || (start && end ? `${start} - ${end}` : start || "");
    db.run(
      "UPDATE experience SET role=?, title=?, company=?, company_url=?, start=?, end=?, duration=?, location=?, description=?, image=?, logo_path=?, section_type=?, color=? WHERE id=?",
      [
        t,
        t,
        company,
        company_url,
        start,
        end,
        dur,
        location,
        description,
        image,
        image,
        section_type || "work",
        color,
        req.params.id,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  }
);

// API: Delete experience
app.delete("/api/experience/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM experience WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// API: Get all images
app.get("/api/images", (req, res) => {
  db.all("SELECT * FROM images", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add image
app.post("/api/images", adminAuth, upload.single("file"), (req, res) => {
  const { type, alt } = req.body;
  const filename = req.file ? `/uploads/${req.file.filename}` : null;
  db.run(
    "INSERT INTO images (filename, type, alt) VALUES (?, ?, ?)",
    [filename, type, alt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// API: Delete image
app.delete("/api/images/:id", adminAuth, (req, res) => {
  db.get(
    "SELECT filename FROM images WHERE id=?",
    [req.params.id],
    (err, row) => {
      if (row && row.filename) {
        const fs = require("fs");
        const filePath = path.join(__dirname, "../public", row.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      db.run("DELETE FROM images WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
      });
    }
  );
});

// API: Get site details
app.get("/api/site-details", (req, res) => {
  db.get("SELECT * FROM site_details WHERE id=1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// API: Update site details
app.put("/api/site-details", adminAuth, (req, res) => {
  const { bio, skills, contact } = req.body;
  db.run(
    "INSERT INTO site_details (id, bio, skills, contact) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET bio=excluded.bio, skills=excluded.skills, contact=excluded.contact",
    [bio, skills, contact],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// ========== HOME APIs ==========
app.get("/api/home", (req, res) => {
  db.get("SELECT * FROM home WHERE id=1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.get("/api/social-links", (req, res) => {
  db.all(
    "SELECT * FROM social_links ORDER BY sort_order, id",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});
app.get("/api/skills", (req, res) => {
  db.get("SELECT data FROM skills WHERE id=1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row && row.data ? JSON.parse(row.data) : null);
  });
});
app.put("/api/home", adminAuth, (req, res) => {
  const {
    title,
    logo_name,
    nickname,
    subTitle,
    resumeLink,
    portfolio_repository,
    githubProfile,
  } = req.body;
  db.run(
    "INSERT INTO home (id, title, logo_name, nickname, subTitle, resumeLink, portfolio_repository, githubProfile) VALUES (1,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, logo_name=excluded.logo_name, nickname=excluded.nickname, subTitle=excluded.subTitle, resumeLink=excluded.resumeLink, portfolio_repository=excluded.portfolio_repository, githubProfile=excluded.githubProfile",
    [
      title,
      logo_name,
      nickname,
      subTitle,
      resumeLink,
      portfolio_repository,
      githubProfile,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.put("/api/skills", adminAuth, (req, res) => {
  const data = JSON.stringify(req.body);
  db.run(
    "INSERT INTO skills (id, data) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
    [data],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.post("/api/social-links", adminAuth, (req, res) => {
  const { name, link, fontAwesomeIcon, backgroundColor, sort_order } = req.body;
  db.run(
    "INSERT INTO social_links (name, link, fontAwesomeIcon, backgroundColor, sort_order) VALUES (?,?,?,?,?)",
    [name, link, fontAwesomeIcon, backgroundColor || "#333", sort_order || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
app.put("/api/social-links/:id", adminAuth, (req, res) => {
  const { name, link, fontAwesomeIcon, backgroundColor, sort_order } = req.body;
  db.run(
    "UPDATE social_links SET name=?, link=?, fontAwesomeIcon=?, backgroundColor=?, sort_order=? WHERE id=?",
    [
      name,
      link,
      fontAwesomeIcon,
      backgroundColor || "#333",
      sort_order || 0,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete("/api/social-links/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM social_links WHERE id=?", [req.params.id], function (
    err
  ) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// ========== EDUCATION APIs (degrees, competitive_sites) ==========
app.get("/api/degrees", (req, res) => {
  db.all("SELECT * FROM degrees ORDER BY id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows = rows.map((r) => ({
      ...r,
      descriptions: r.descriptions ? JSON.parse(r.descriptions) : [],
    }));
    res.json(rows);
  });
});
app.post("/api/degrees", adminAuth, upload.single("logo_path"), (req, res) => {
  const {
    title,
    subtitle,
    alt_name,
    duration,
    descriptions,
    website_link,
  } = req.body;
  const logo = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.logo_path || null;
  const desc = Array.isArray(descriptions)
    ? JSON.stringify(descriptions)
    : descriptions || "[]";
  db.run(
    "INSERT INTO degrees (title, subtitle, logo_path, alt_name, duration, descriptions, website_link) VALUES (?,?,?,?,?,?,?)",
    [title, subtitle, logo, alt_name, duration, desc, website_link],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
app.put(
  "/api/degrees/:id",
  adminAuth,
  upload.single("logo_path"),
  (req, res) => {
    const {
      title,
      subtitle,
      alt_name,
      duration,
      descriptions,
      website_link,
    } = req.body;
    const logo = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.logo_path || null;
    const desc = Array.isArray(descriptions)
      ? JSON.stringify(descriptions)
      : typeof descriptions === "string"
      ? descriptions
      : "[]";
    db.run(
      "UPDATE degrees SET title=?, subtitle=?, logo_path=?, alt_name=?, duration=?, descriptions=?, website_link=? WHERE id=?",
      [
        title,
        subtitle,
        logo,
        alt_name,
        duration,
        desc,
        website_link,
        req.params.id,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  }
);
app.delete("/api/degrees/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM degrees WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});
app.get("/api/competitive-sites", (req, res) => {
  db.all(
    "SELECT * FROM competitive_sites ORDER BY sort_order, id",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      rows = rows.map((r) => ({
        ...r,
        style: r.style ? JSON.parse(r.style) : {},
      }));
      res.json(rows);
    }
  );
});
app.post("/api/competitive-sites", adminAuth, (req, res) => {
  const {
    siteName,
    iconifyClassname,
    style,
    profileLink,
    sort_order,
  } = req.body;
  const styleStr =
    typeof style === "object" ? JSON.stringify(style) : style || "{}";
  db.run(
    "INSERT INTO competitive_sites (siteName, iconifyClassname, style, profileLink, sort_order) VALUES (?,?,?,?,?)",
    [siteName, iconifyClassname, styleStr, profileLink, sort_order || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
app.put("/api/competitive-sites/:id", adminAuth, (req, res) => {
  const {
    siteName,
    iconifyClassname,
    style,
    profileLink,
    sort_order,
  } = req.body;
  const styleStr =
    typeof style === "object" ? JSON.stringify(style) : style || "{}";
  db.run(
    "UPDATE competitive_sites SET siteName=?, iconifyClassname=?, style=?, profileLink=?, sort_order=? WHERE id=?",
    [
      siteName,
      iconifyClassname,
      styleStr,
      profileLink,
      sort_order || 0,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
app.delete("/api/competitive-sites/:id", adminAuth, (req, res) => {
  db.run("DELETE FROM competitive_sites WHERE id=?", [req.params.id], function (
    err
  ) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// ========== Experience meta & extended experience ==========
app.get("/api/experience-meta", (req, res) => {
  db.get("SELECT * FROM experience_meta WHERE id=1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.put("/api/experience-meta", adminAuth, (req, res) => {
  const { title, subtitle, description } = req.body;
  db.run(
    "INSERT INTO experience_meta (id, title, subtitle, description) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, subtitle=excluded.subtitle, description=excluded.description",
    [title, subtitle, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// ========== Projects header ==========
app.get("/api/projects-header", (req, res) => {
  db.get("SELECT * FROM projects_header WHERE id=1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});
app.put("/api/projects-header", adminAuth, (req, res) => {
  const { title, description, avatar_image_path } = req.body;
  db.run(
    "INSERT INTO projects_header (id, title, description, avatar_image_path) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, avatar_image_path=excluded.avatar_image_path",
    [title, description, avatar_image_path],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// ========== Contact data ==========
app.get("/api/contact-data", (req, res) => {
  db.get("SELECT * FROM contact_data WHERE id=1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const result = {};
    if (row) {
      if (row.contact_section)
        result.contactSection = JSON.parse(row.contact_section);
      if (row.blog_section) result.blogSection = JSON.parse(row.blog_section);
      if (row.address_section)
        result.addressSection = JSON.parse(row.address_section);
      if (row.phone_section)
        result.phoneSection = JSON.parse(row.phone_section);
    }
    res.json(result);
  });
});
app.put("/api/contact-data", adminAuth, (req, res) => {
  const {
    contactSection,
    blogSection,
    addressSection,
    phoneSection,
  } = req.body;
  const cs = contactSection ? JSON.stringify(contactSection) : null;
  const bs = blogSection ? JSON.stringify(blogSection) : null;
  const as = addressSection ? JSON.stringify(addressSection) : null;
  const ps = phoneSection ? JSON.stringify(phoneSection) : null;
  db.run(
    "INSERT INTO contact_data (id, contact_section, blog_section, address_section, phone_section) VALUES (1,?,?,?,?) ON CONFLICT(id) DO UPDATE SET contact_section=excluded.contact_section, blog_section=excluded.blog_section, address_section=excluded.address_section, phone_section=excluded.phone_section",
    [cs, bs, as, ps],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// ========== Seed from portfolio (admin only) ==========
app.post("/api/seed", adminAuth, (req, res) => {
  const portfolio = req.body;
  if (!portfolio || !portfolio.greeting) {
    return res.status(400).json({ error: "Invalid portfolio data" });
  }
  const dbRun = (sql, params) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  (async () => {
    try {
      const g = portfolio.greeting;
      await dbRun(
        "INSERT OR REPLACE INTO home (id, title, logo_name, nickname, subTitle, resumeLink, portfolio_repository, githubProfile) VALUES (1,?,?,?,?,?,?,?)",
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
      await dbRun("DELETE FROM social_links");
      for (let i = 0; i < (portfolio.socialMediaLinks || []).length; i++) {
        const s = portfolio.socialMediaLinks[i];
        await dbRun(
          "INSERT INTO social_links (name, link, fontAwesomeIcon, backgroundColor, sort_order) VALUES (?,?,?,?,?)",
          [s.name, s.link, s.fontAwesomeIcon, s.backgroundColor || "#333", i]
        );
      }
      await dbRun("INSERT OR REPLACE INTO skills (id, data) VALUES (1,?)", [
        JSON.stringify(portfolio.skills || { data: [] }),
      ]);
      await dbRun("DELETE FROM degrees");
      for (const d of portfolio.degrees?.degrees || []) {
        await dbRun(
          "INSERT INTO degrees (title, subtitle, logo_path, alt_name, duration, descriptions, website_link) VALUES (?,?,?,?,?,?,?)",
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
      await dbRun("DELETE FROM competitive_sites");
      for (
        let i = 0;
        i < (portfolio.competitiveSites?.competitiveSites || []).length;
        i++
      ) {
        const c = portfolio.competitiveSites.competitiveSites[i];
        await dbRun(
          "INSERT INTO competitive_sites (siteName, iconifyClassname, style, profileLink, sort_order) VALUES (?,?,?,?,?)",
          [
            c.siteName,
            c.iconifyClassname,
            JSON.stringify(c.style || {}),
            c.profileLink,
            i,
          ]
        );
      }
      await dbRun("DELETE FROM certificates");
      for (const c of portfolio.certifications?.certifications || []) {
        await dbRun(
          "INSERT INTO certificates (title, issuer, subtitle, logo_path, url, certificate_link, alt_name, color_code, description) VALUES (?,?,?,?,?,?,?,?,?)",
          [
            c.title,
            (c.subtitle || "").replace(/^- /, "") || c.issuer,
            c.subtitle,
            c.logo_path,
            c.certificate_link || c.url,
            c.certificate_link || c.url,
            c.alt_name,
            c.color_code || "",
            "",
          ]
        );
      }
      await dbRun("DELETE FROM experience");
      const stMap = {
        Work: "work",
        Internships: "internship",
        Volunteerships: "volunteer",
      };
      for (const section of portfolio.experience?.sections || []) {
        const st = stMap[section.title] || "work";
        for (const ex of section.experiences || []) {
          await dbRun(
            "INSERT INTO experience (role, title, company, company_url, duration, location, description, logo_path, section_type, color) VALUES (?,?,?,?,?,?,?,?,?,?)",
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
      await dbRun(
        "INSERT OR REPLACE INTO experience_meta (id, title, subtitle, description) VALUES (1,?,?,?)",
        [
          portfolio.experience?.title || "",
          portfolio.experience?.subtitle || "",
          portfolio.experience?.description || "",
        ]
      );
      await dbRun(
        "INSERT OR REPLACE INTO projects_header (id, title, description, avatar_image_path) VALUES (1,?,?,?)",
        [
          portfolio.projectsHeader?.title || "",
          portfolio.projectsHeader?.description || "",
          portfolio.projectsHeader?.avatar_image_path || "",
        ]
      );
      await dbRun(
        "INSERT OR REPLACE INTO contact_data (id, contact_section, blog_section, address_section, phone_section) VALUES (1,?,?,?,?)",
        [
          JSON.stringify(portfolio.contactPageData?.contactSection || {}),
          JSON.stringify(portfolio.contactPageData?.blogSection || {}),
          JSON.stringify(portfolio.contactPageData?.addressSection || {}),
          JSON.stringify(portfolio.contactPageData?.phoneSection || {}),
        ]
      );
      const countRes = await new Promise((res, rej) =>
        db.get("SELECT COUNT(*) as c FROM projects", (e, r) =>
          e ? rej(e) : res(r)
        )
      );
      if (countRes.c === 0 && portfolio.projectsData?.data) {
        for (const p of portfolio.projectsData.data) {
          const year = p.createdAt
            ? new Date(p.createdAt).getFullYear().toString()
            : "";
          const langs = p.languages || [];
          await dbRun(
            "INSERT INTO projects (name, description, year, url, technologies, languages) VALUES (?,?,?,?,?,?)",
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
      } else if (countRes.c === 0) {
        try {
          const proj = require("../src/shared/opensource/projects.json");
          for (const p of proj.data || []) {
            const year = p.createdAt
              ? new Date(p.createdAt).getFullYear().toString()
              : "";
            const langs = (p.languages || []).map((l) => ({
              name: l.name,
              iconifyClass: l.iconifyClass,
            }));
            await dbRun(
              "INSERT INTO projects (name, description, year, url, technologies, languages) VALUES (?,?,?,?,?,?)",
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
        } catch (e) {}
      }
      res.json({ success: true, message: "Database seeded from portfolio" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })();
});

// ========== Unified portfolio API (for main site) ==========
app.get("/api/portfolio", (req, res) => {
  const result = {};
  const queries = [
    { key: "home", sql: "SELECT * FROM home WHERE id=1" },
    {
      key: "socialLinks",
      sql: "SELECT * FROM social_links ORDER BY sort_order, id",
    },
    { key: "skills", sql: "SELECT data FROM skills WHERE id=1" },
    { key: "degrees", sql: "SELECT * FROM degrees ORDER BY id" },
    {
      key: "competitiveSites",
      sql: "SELECT * FROM competitive_sites ORDER BY sort_order, id",
    },
    { key: "certificates", sql: "SELECT * FROM certificates" },
    { key: "experience", sql: "SELECT * FROM experience ORDER BY id" },
    { key: "experienceMeta", sql: "SELECT * FROM experience_meta WHERE id=1" },
    { key: "projects", sql: "SELECT * FROM projects ORDER BY id" },
    { key: "projectsHeader", sql: "SELECT * FROM projects_header WHERE id=1" },
    { key: "research", sql: "SELECT * FROM research ORDER BY date DESC" },
    { key: "contactData", sql: "SELECT * FROM contact_data WHERE id=1" },
  ];
  let done = 0;
  const total = queries.length;
  queries.forEach(({ key, sql }) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        result[key] = null;
      } else {
        if (key === "skills" && rows[0])
          result[key] = JSON.parse(rows[0].data || "{}");
        else if (key === "degrees")
          result[key] = rows.map((r) => ({
            ...r,
            descriptions: r.descriptions ? JSON.parse(r.descriptions) : [],
          }));
        else if (key === "competitiveSites")
          result[key] = rows.map((r) => ({
            ...r,
            style: r.style ? JSON.parse(r.style) : {},
          }));
        else if (key === "experience") result[key] = rows;
        else if (key === "contactData" && rows[0]) {
          const r = rows[0];
          result[key] = {};
          if (r.contact_section)
            result[key].contactSection = JSON.parse(r.contact_section);
          if (r.blog_section)
            result[key].blogSection = JSON.parse(r.blog_section);
          if (r.address_section)
            result[key].addressSection = JSON.parse(r.address_section);
          if (r.phone_section)
            result[key].phoneSection = JSON.parse(r.phone_section);
        } else if (key === "research")
          result[key] = rows.map((r) => {
            let images = [];
            if (r.image) {
              try {
                const parsed = JSON.parse(r.image);
                images = Array.isArray(parsed) ? parsed : [r.image];
              } catch {
                images = [r.image];
              }
            }
            return {
              ...r,
              id: r.id,
              name: r.title,
              createdAt: r.date,
              description: r.content || r.abstract,
              summary: r.abstract,
              url: r.url,
              images,
            };
          });
        else if (
          rows.length === 1 &&
          ![
            "socialLinks",
            "degrees",
            "competitiveSites",
            "certificates",
            "experience",
            "projects",
            "research",
          ].includes(key)
        )
          result[key] = rows[0];
        else result[key] = rows;
      }
      done++;
      if (done === total) res.json(result);
    });
  });
});

// Serve React app (optional, for production build)
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
