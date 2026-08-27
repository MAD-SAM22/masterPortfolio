import React, { useState, useEffect } from "react";

const APIs = {
  home: "/api/home",
  socialLinks: "/api/social-links",
  skills: "/api/skills",
};

export default function AdminHome({ adminToken }) {
  const [home, setHome] = useState({
    title: "",
    logo_name: "",
    nickname: "",
    subTitle: "",
    resumeLink: "",
    portfolio_repository: "",
    githubProfile: "",
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [skills, setSkills] = useState("");
  const [editingLink, setEditingLink] = useState(null);
  const [linkForm, setLinkForm] = useState({
    name: "",
    link: "",
    fontAwesomeIcon: "",
    backgroundColor: "#333",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(APIs.home)
      .then((r) => r.json())
      .then(
        (d) =>
          d &&
          setHome({
            title: d.title || "",
            logo_name: d.logo_name || "",
            nickname: d.nickname || "",
            subTitle: d.subTitle || "",
            resumeLink: d.resumeLink || "",
            portfolio_repository: d.portfolio_repository || "",
            githubProfile: d.githubProfile || "",
          })
      );
    fetch(APIs.socialLinks)
      .then((r) => r.json())
      .then(setSocialLinks);
    fetch(APIs.skills)
      .then((r) => r.json())
      .then((d) =>
        setSkills(
          d
            ? typeof d === "object" && d.data
              ? JSON.stringify(d, null, 2)
              : JSON.stringify(d, null, 2)
            : ""
        )
      );
  }, []);

  const saveHome = (e) => {
    e.preventDefault();
    fetch(APIs.home, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(home),
    }).then(() => setMsg("Home saved!"));
  };

  const saveSkills = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(skills);
      fetch(APIs.skills, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(parsed),
      }).then(() => setMsg("Skills saved!"));
    } catch (err) {
      setMsg("Invalid JSON for skills");
    }
  };

  const saveLink = (e) => {
    e.preventDefault();
    const url = editingLink
      ? `${APIs.socialLinks}/${editingLink.id}`
      : APIs.socialLinks;
    const method = editingLink ? "PUT" : "POST";
    const body = editingLink
      ? JSON.stringify({ ...linkForm, id: editingLink.id })
      : JSON.stringify(linkForm);
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body,
    }).then(() => {
      setEditingLink(null);
      setLinkForm({
        name: "",
        link: "",
        fontAwesomeIcon: "",
        backgroundColor: "#333",
      });
      fetch(APIs.socialLinks)
        .then((r) => r.json())
        .then(setSocialLinks);
      setMsg("Social link saved!");
    });
  };

  const deleteLink = (id) => {
    if (!window.confirm("Delete this link?")) return;
    fetch(`${APIs.socialLinks}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() =>
      fetch(APIs.socialLinks)
        .then((r) => r.json())
        .then(setSocialLinks)
    );
  };

  const css = {
    input: {
      width: "100%",
      padding: 8,
      marginBottom: 12,
      border: "1px solid #ccc",
      borderRadius: 4,
    },
    btn: {
      padding: "8px 16px",
      background: "#222",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      marginRight: 8,
    },
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h3>Home Section</h3>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <form onSubmit={saveHome} style={{ marginBottom: 32 }}>
        <input
          name="title"
          style={css.input}
          value={home.title}
          onChange={(e) => setHome((h) => ({ ...h, title: e.target.value }))}
          placeholder="Title"
          required
        />
        <input
          name="nickname"
          style={css.input}
          value={home.nickname}
          onChange={(e) => setHome((h) => ({ ...h, nickname: e.target.value }))}
          placeholder="Nickname"
        />
        <textarea
          name="subTitle"
          style={{ ...css.input, minHeight: 60 }}
          value={home.subTitle}
          onChange={(e) => setHome((h) => ({ ...h, subTitle: e.target.value }))}
          placeholder="Subtitle"
          required
        />
        <input
          name="resumeLink"
          style={css.input}
          value={home.resumeLink}
          onChange={(e) =>
            setHome((h) => ({ ...h, resumeLink: e.target.value }))
          }
          placeholder="Resume URL"
        />
        <input
          name="portfolio_repository"
          style={css.input}
          value={home.portfolio_repository}
          onChange={(e) =>
            setHome((h) => ({ ...h, portfolio_repository: e.target.value }))
          }
          placeholder="Portfolio Repo URL"
        />
        <input
          name="githubProfile"
          style={css.input}
          value={home.githubProfile}
          onChange={(e) =>
            setHome((h) => ({ ...h, githubProfile: e.target.value }))
          }
          placeholder="GitHub Profile URL"
        />
        <button type="submit" style={css.btn}>
          Save Home
        </button>
      </form>

      <h3>Social Links</h3>
      <form onSubmit={saveLink} style={{ marginBottom: 16 }}>
        <input
          style={css.input}
          value={linkForm.name}
          onChange={(e) => setLinkForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Name (e.g. Github)"
          required
        />
        <input
          style={css.input}
          value={linkForm.link}
          onChange={(e) => setLinkForm((f) => ({ ...f, link: e.target.value }))}
          placeholder="URL"
          required
        />
        <input
          style={css.input}
          value={linkForm.fontAwesomeIcon}
          onChange={(e) =>
            setLinkForm((f) => ({ ...f, fontAwesomeIcon: e.target.value }))
          }
          placeholder="FontAwesome icon (e.g. fa-github)"
        />
        <input
          style={css.input}
          value={linkForm.backgroundColor}
          onChange={(e) =>
            setLinkForm((f) => ({ ...f, backgroundColor: e.target.value }))
          }
          placeholder="Background color"
        />
        <button type="submit" style={css.btn}>
          {editingLink ? "Update" : "Add"} Link
        </button>
        {editingLink && (
          <button
            type="button"
            style={{ ...css.btn, background: "#666" }}
            onClick={() => {
              setEditingLink(null);
              setLinkForm({
                name: "",
                link: "",
                fontAwesomeIcon: "",
                backgroundColor: "#333",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {socialLinks.map((s) => (
          <li
            key={s.id}
            style={{
              padding: 8,
              marginBottom: 4,
              background: "#f5f5f5",
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{s.name}</strong> – {s.link}
            </span>
            <span>
              <button
                style={{ ...css.btn, padding: "4px 10px", marginRight: 4 }}
                onClick={() => {
                  setEditingLink(s);
                  setLinkForm({
                    name: s.name,
                    link: s.link,
                    fontAwesomeIcon: s.fontAwesomeIcon || "",
                    backgroundColor: s.backgroundColor || "#333",
                  });
                }}
              >
                Edit
              </button>
              <button
                style={{ ...css.btn, padding: "4px 10px", background: "#c00" }}
                onClick={() => deleteLink(s.id)}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>

      <h3>Skills (JSON)</h3>
      <p style={{ color: "#666", fontSize: 12 }}>
        Edit the skills object. Must be valid JSON with a "data" array of skill
        categories.
      </p>
      <form onSubmit={saveSkills}>
        <textarea
          style={{ ...css.input, minHeight: 300, fontFamily: "monospace" }}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder='{"data": [...]}'
        />
        <button type="submit" style={css.btn}>
          Save Skills
        </button>
      </form>
    </div>
  );
}
