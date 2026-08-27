import React, { useState, useEffect } from "react";

const API = "/api/competitive-sites";

export default function AdminCompetitiveSites({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    siteName: "",
    iconifyClassname: "",
    style: "{}",
    profileLink: "",
  });

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const handleEdit = (c) => {
    setEditing(c.id);
    setForm({
      siteName: c.siteName || "",
      iconifyClassname: c.iconifyClassname || "",
      style:
        typeof c.style === "object" ? JSON.stringify(c.style) : c.style || "{}",
      profileLink: c.profileLink || "",
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this site?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => setItems(items.filter((i) => i.id !== id)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let style = {};
    try {
      style = JSON.parse(form.style || "{}");
    } catch {}
    const payload = { ...form, style };
    const url = editing ? `${API}/${editing}` : API;
    const method = editing ? "PUT" : "POST";
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(payload),
    }).then(() => {
      fetch(API)
        .then((r) => r.json())
        .then(setItems);
      setEditing(null);
      setForm({
        siteName: "",
        iconifyClassname: "",
        style: "{}",
        profileLink: "",
      });
    });
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
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="siteName"
          style={css.input}
          value={form.siteName}
          onChange={handleChange}
          placeholder="Site name (e.g. LeetCode)"
          required
        />
        <input
          name="iconifyClassname"
          style={css.input}
          value={form.iconifyClassname}
          onChange={handleChange}
          placeholder="Iconify class (e.g. simple-icons:leetcode)"
        />
        <input
          name="style"
          style={css.input}
          value={form.style}
          onChange={handleChange}
          placeholder='Style JSON (e.g. {"color":"#F79F1B"})'
        />
        <input
          name="profileLink"
          style={css.input}
          value={form.profileLink}
          onChange={handleChange}
          placeholder="Profile URL"
          required
        />
        <button type="submit" style={css.btn}>
          {editing ? "Update" : "Add"} Site
        </button>
        {editing && (
          <button
            type="button"
            style={{ ...css.btn, background: "#666" }}
            onClick={() => {
              setEditing(null);
              setForm({
                siteName: "",
                iconifyClassname: "",
                style: "{}",
                profileLink: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((c) => (
          <li
            key={c.id}
            style={{
              padding: 12,
              marginBottom: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          >
            <strong>{c.siteName}</strong> –{" "}
            <a href={c.profileLink} target="_blank" rel="noopener noreferrer">
              {c.profileLink}
            </a>
            <div style={{ marginTop: 8 }}>
              <button
                style={{ ...css.btn, padding: "4px 10px" }}
                onClick={() => handleEdit(c)}
              >
                Edit
              </button>
              <button
                style={{ ...css.btn, padding: "4px 10px", background: "#c00" }}
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
