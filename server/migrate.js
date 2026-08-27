// DB migration: import current JSON projects into SQLite
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./portfolio.db");
const projectsJson = require("../src/shared/opensource/projects.json");

function parseTech(langs) {
  return langs.map((l) => l.name).join(", ");
}

function parseYear(createdAt) {
  if (!createdAt) return "";
  return new Date(createdAt).getFullYear().toString();
}

function migrate() {
  db.serialize(() => {
    db.run("DELETE FROM projects");
    projectsJson.data.forEach((p) => {
      db.run(
        "INSERT INTO projects (name, description, year, url, image, technologies) VALUES (?, ?, ?, ?, ?, ?)",
        [
          p.name,
          p.description,
          parseYear(p.createdAt),
          p.url,
          null,
          parseTech(p.languages),
        ]
      );
    });
    console.log("Migration complete.");
  });
}

migrate();
