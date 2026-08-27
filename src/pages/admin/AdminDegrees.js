import React, { useState, useEffect } from "react";

const API = "/api/degrees";

export default function AdminDegrees({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    logo_path: "",
    alt_name: "",
    duration: "",
    descriptions: "[]",
    website_link: "",
  });

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const handleEdit = (d) => {
    setEditing(d.id);
    setForm({
      title: d.title || "",
      subtitle: d.subtitle || "",
      logo_path: d.logo_path || "",
      alt_name: d.alt_name || "",
      duration: d.duration || "",
      descriptions: Array.isArray(d.descriptions)
        ? JSON.stringify(d.descriptions, null, 2)
        : d.descriptions || "[]",
      website_link: d.website_link || "",
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this degree?")) return;
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
    let descriptions = [];
    try {
      descriptions = JSON.parse(form.descriptions || "[]");
    } catch {}
    const payload = { ...form, descriptions };
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
        title: "",
        subtitle: "",
        logo_path: "",
        alt_name: "",
        duration: "",
        descriptions: "[]",
        website_link: "",
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
          name="title"
          style={css.input}
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="subtitle"
          style={css.input}
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Subtitle"
        />
        <input
          name="logo_path"
          style={css.input}
          value={form.logo_path}
          onChange={handleChange}
          placeholder="Logo filename (e.g. iti_logo.png)"
        />
        <input
          name="alt_name"
          style={css.input}
          value={form.alt_name}
          onChange={handleChange}
          placeholder="Alt name"
        />
        <input
          name="duration"
          style={css.input}
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (e.g. 2021 - 2025)"
        />
        <textarea
          name="descriptions"
          style={{ ...css.input, minHeight: 80 }}
          value={form.descriptions}
          onChange={handleChange}
          placeholder='["⚡ Point 1", "⚡ Point 2"]'
        />
        <input
          name="website_link"
          style={css.input}
          value={form.website_link}
          onChange={handleChange}
          placeholder="Website URL"
        />
        <button type="submit" style={css.btn}>
          {editing ? "Update" : "Add"} Degree
        </button>
        {editing && (
          <button
            type="button"
            style={{ ...css.btn, background: "#666" }}
            onClick={() => {
              setEditing(null);
              setForm({
                title: "",
                subtitle: "",
                logo_path: "",
                alt_name: "",
                duration: "",
                descriptions: "[]",
                website_link: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((d) => (
          <li
            key={d.id}
            style={{
              padding: 12,
              marginBottom: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          >
            <strong>{d.title}</strong> – {d.subtitle} ({d.duration})
            <div style={{ marginTop: 8 }}>
              <button
                style={{ ...css.btn, padding: "4px 10px" }}
                onClick={() => handleEdit(d)}
              >
                Edit
              </button>
              <button
                style={{ ...css.btn, padding: "4px 10px", background: "#c00" }}
                onClick={() => handleDelete(d.id)}
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
