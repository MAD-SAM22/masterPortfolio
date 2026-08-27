# Admin Dashboard - SQLite Setup

The admin dashboard reads and writes all portfolio data from an SQLite database. It supports full CRUD for:

- **Home** – Greeting, social links, skills
- **Education** – Degrees, competitive sites, certificates
- **Experience** – Work history with sections (Work, Internships, Volunteerships)
- **Projects** – Projects list and page header
- **Contact Me** – Contact section, address, blog

## Running the App

1. **Start the backend server:**

   ```bash
   npm run server
   ```

   This starts the Express server on port 5000 with the SQLite database.

2. **Start the React app:**

   ```bash
   npm start
   ```

   The dev server proxies `/api` and `/uploads` to the backend.

3. **Open the admin dashboard:**
   - Go to `http://localhost:3000/admin`
   - Default password: `admin123` (set via `ADMIN_PASSWORD` in `server/.env`)

## Initial Database Setup

1. Log in to the admin dashboard.
2. Click **"Seed from portfolio.js"** to populate the database from your static `src/portfolio.js` and `src/shared/opensource/projects.json` files.
3. All sections (Home, Education, Experience, Projects, Contact) will be populated from your current static data.

## Data Flow

- **Main site**: Fetches data from `/api/portfolio` when the API is available. Falls back to static `portfolio.js` when the API is not reachable (e.g., static deployment).
- **Admin dashboard**: Reads and writes via individual API endpoints (`/api/home`, `/api/degrees`, `/api/experience`, etc.).

## Database Location

- SQLite file: `server/portfolio.db`
- Uploaded images: `public/uploads/`
