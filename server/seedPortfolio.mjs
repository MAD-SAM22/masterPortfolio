// Seed portfolio DB - ESM version (run with: node server/seedPortfolio.mjs)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));
const assetsDir = path.join(__dirname, '../src/assets/images');
const uploadsDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function copyImage(filename) {
  if (!filename) return null;
  const src = path.join(assetsDir, filename);
  if (fs.existsSync(src)) {
    const dest = path.join(uploadsDir, filename);
    try {
      fs.copyFileSync(src, dest);
      return `/uploads/${filename}`;
    } catch (e) {
      console.warn('Could not copy', filename, e.message);
    }
  }
  return filename;
}

function exec(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

const initSql = `
CREATE TABLE IF NOT EXISTS home (id INTEGER PRIMARY KEY CHECK (id = 1), title TEXT, logo_name TEXT, nickname TEXT, subTitle TEXT, resumeLink TEXT, portfolio_repository TEXT, githubProfile TEXT);
CREATE TABLE IF NOT EXISTS social_links (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, link TEXT, fontAwesomeIcon TEXT, backgroundColor TEXT, sort_order INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT);
CREATE TABLE IF NOT EXISTS degrees (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, subtitle TEXT, logo_path TEXT, alt_name TEXT, duration TEXT, descriptions TEXT, website_link TEXT);
CREATE TABLE IF NOT EXISTS competitive_sites (id INTEGER PRIMARY KEY AUTOINCREMENT, siteName TEXT, iconifyClassname TEXT, style TEXT, profileLink TEXT, sort_order INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS certificates (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, issuer TEXT, subtitle TEXT, date TEXT, image TEXT, logo_path TEXT, url TEXT, certificate_link TEXT, description TEXT, alt_name TEXT, color_code TEXT);
CREATE TABLE IF NOT EXISTS experience (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, title TEXT, company TEXT, company_url TEXT, start TEXT, end TEXT, duration TEXT, location TEXT, description TEXT, image TEXT, logo_path TEXT, section_type TEXT, color TEXT);
CREATE TABLE IF NOT EXISTS experience_meta (id INTEGER PRIMARY KEY CHECK (id = 1), title TEXT, subtitle TEXT, description TEXT);
CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, year TEXT, url TEXT, image TEXT, technologies TEXT, content TEXT, languages TEXT);
CREATE TABLE IF NOT EXISTS projects_header (id INTEGER PRIMARY KEY CHECK (id = 1), title TEXT, description TEXT, avatar_image_path TEXT);
CREATE TABLE IF NOT EXISTS research (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, abstract TEXT, date TEXT, url TEXT, image TEXT, content TEXT);
CREATE TABLE IF NOT EXISTS contact_data (id INTEGER PRIMARY KEY CHECK (id = 1), contact_section TEXT, blog_section TEXT, address_section TEXT, phone_section TEXT);
`;

async function runSeed() {
  db.exec(initSql);
  const portfolio = await import('../src/portfolio.js');
  const projectsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/shared/opensource/projects.json'), 'utf8'));

  const g = portfolio.greeting || {};
  await exec(
    `INSERT OR REPLACE INTO home (id, title, logo_name, nickname, subTitle, resumeLink, portfolio_repository, githubProfile) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
    [g.title || '', g.logo_name || g.title || '', g.nickname || '', g.subTitle || '', g.resumeLink || '', g.portfolio_repository || '', g.githubProfile || '']
  );

  await exec('DELETE FROM social_links');
  for (let i = 0; i < (portfolio.socialMediaLinks || []).length; i++) {
    const s = portfolio.socialMediaLinks[i];
    await exec(
      'INSERT INTO social_links (name, link, fontAwesomeIcon, backgroundColor, sort_order) VALUES (?,?,?,?,?)',
      [s.name || '', s.link || '', s.fontAwesomeIcon || '', s.backgroundColor || '#333', i]
    );
  }

  await exec('INSERT OR REPLACE INTO skills (id, data) VALUES (1, ?)', [JSON.stringify(portfolio.skills || {})]);

  await exec('DELETE FROM degrees');
  for (const d of (portfolio.degrees?.degrees || [])) {
    const imgPath = copyImage(d.logo_path) || d.logo_path;
    await exec(
      'INSERT INTO degrees (title, subtitle, logo_path, alt_name, duration, descriptions, website_link) VALUES (?,?,?,?,?,?,?)',
      [d.title, d.subtitle, imgPath, d.alt_name, d.duration, JSON.stringify(d.descriptions || []), d.website_link]
    );
  }

  await exec('DELETE FROM competitive_sites');
  for (let i = 0; i < (portfolio.competitiveSites?.competitiveSites || []).length; i++) {
    const s = portfolio.competitiveSites.competitiveSites[i];
    await exec(
      'INSERT INTO competitive_sites (siteName, iconifyClassname, style, profileLink, sort_order) VALUES (?,?,?,?,?)',
      [s.siteName, s.iconifyClassname || '', JSON.stringify(s.style || {}), s.profileLink || '', i]
    );
  }

  await exec('DELETE FROM certificates');
  for (const c of (portfolio.certifications?.certifications || [])) {
    const imgPath = copyImage(c.logo_path) || c.logo_path;
    await exec(
      'INSERT INTO certificates (title, subtitle, issuer, date, url, certificate_link, image, logo_path, description, alt_name, color_code) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [c.title, c.subtitle || '', c.subtitle || '', '', c.certificate_link, c.certificate_link, imgPath, imgPath, '', c.alt_name || '', c.color_code || '']
    );
  }

  await exec('DELETE FROM experience');
  const exp = portfolio.experience || {};
  await exec(
    'INSERT OR REPLACE INTO experience_meta (id, title, subtitle, description) VALUES (1,?,?,?)',
    [exp.title || 'Experience', exp.subtitle || '', exp.description || '']
  );
  for (const sec of (exp.sections || [])) {
    const sectionType = (sec.title || '').toLowerCase().includes('intern') ? 'internship' : (sec.title || '').toLowerCase().includes('volunt') ? 'volunteership' : 'work';
    for (const e of (sec.experiences || [])) {
      const imgPath = copyImage(e.logo_path) || e.logo_path;
      await exec(
        'INSERT INTO experience (role, title, company, company_url, duration, location, description, image, logo_path, section_type, color) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [e.title, e.title, e.company, e.company_url || '', e.duration || '', e.location || '', e.description || '', imgPath, imgPath, sectionType, e.color || '#000000']
      );
    }
  }

  await exec('DELETE FROM projects');
  for (const p of (projectsJson.data || [])) {
    const year = p.createdAt ? new Date(p.createdAt).getFullYear().toString() : '';
    const langStr = p.languages ? JSON.stringify(p.languages) : null;
    await exec(
      'INSERT INTO projects (name, description, year, url, technologies, languages) VALUES (?,?,?,?,?,?)',
      [p.name, p.description || '', year, p.url || '#', (p.languages || []).map(l => l.name).join(', '), langStr]
    );
  }

  const ph = portfolio.projectsHeader || {};
  await exec(
    'INSERT OR REPLACE INTO projects_header (id, title, description, avatar_image_path) VALUES (1,?,?,?)',
    [ph.title || 'Projects', ph.description || '', ph.avatar_image_path || 'projects_image.svg']
  );

  await exec('DELETE FROM research');
  for (const p of (portfolio.publications?.data || [])) {
    await exec(
      'INSERT INTO research (title, abstract, date, url) VALUES (?,?,?,?)',
      [p.name, p.description || '', p.createdAt || '', p.url || '']
    );
  }

  const cd = portfolio.contactPageData || {};
  const contactSection = { ...(cd.contactSection || {}) };
  contactSection.profile_image_path = copyImage(contactSection.profile_image_path) || contactSection.profile_image_path;
  await exec(
    'INSERT OR REPLACE INTO contact_data (id, contact_section, blog_section, address_section, phone_section) VALUES (1,?,?,?,?)',
    [JSON.stringify(contactSection), JSON.stringify(cd.blogSection || {}), JSON.stringify(cd.addressSection || {}), JSON.stringify(cd.phoneSection || {})]
  );

  console.log('Portfolio seeded successfully.');
  db.close();
}

runSeed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
