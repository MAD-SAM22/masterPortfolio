import React, { useState, useEffect } from "react";

const API = "/api/experience";
const META_API = "/api/experience-meta";

export default function AdminExperience({ adminToken }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    role: "",
    title: "",
    company: "",
    company_url: "",
    start: "",
    end: "",
    duration: "",
    location: "",
    description: "",
    logo_path: "",
    section_type: "work",
    color: "#000",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setItems);
    fetch(META_API)
      .then((res) => res.json())
      .then(
        (d) =>
          d &&
          setMeta({
            title: d.title || "",
            subtitle: d.subtitle || "",
            description: d.description || "",
          })
      );
  }, []);

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      role: p.role || p.title,
      title: p.title || p.role,
      company: p.company,
      company_url: p.company_url || "",
      start: p.start,
      end: p.end,
      duration: p.duration || "",
      location: p.location || "",
      description: p.description,
      logo_path: p.logo_path || "",
      section_type: p.section_type || "work",
      color: p.color || "#000",
      image: null,
    });
    setImagePreview(p.image && p.image.startsWith("/") ? p.image : null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this experience?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => setItems(items.filter((p) => p.id !== id)));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/${editing}` : API;
    fetch(url, {
      method,
      headers: { "x-admin-token": adminToken },
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        setEditing(null);
        setForm({
          role: "",
          company: "",
          company_url: "",
          start: "",
          end: "",
          location: "",
          description: "",
          logo_path: "",
          section_type: "work",
          color: "#000",
          image: null,
        });
        setImagePreview(null);
        fetch("/api/experience")
          .then((res) => res.json())
          .then(setItems);
      });
  };

  const saveMeta = (e) => {
    e.preventDefault();
    fetch(META_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(meta),
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>Experience Admin</h2>
      <form
        onSubmit={saveMeta}
        style={{
          marginBottom: 24,
          padding: 16,
          background: "#f9f9f9",
          borderRadius: 6,
        }}
      >
        <h4 style={{ marginTop: 0 }}>Page Header</h4>
        <input
          value={meta.title}
          onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
          placeholder="Title"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          value={meta.subtitle}
          onChange={(e) => setMeta((m) => ({ ...m, subtitle: e.target.value }))}
          placeholder="Subtitle"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <textarea
          value={meta.description}
          onChange={(e) =>
            setMeta((m) => ({ ...m, description: e.target.value }))
          }
          placeholder="Description"
          rows={3}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save Header
        </button>
      </form>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          name="title"
          value={form.title || form.role}
          onChange={(e) => {
            const v = e.target.value;
            setForm((f) => ({ ...f, title: v, role: v }));
          }}
          placeholder="Title/Role"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="company_url"
          value={form.company_url}
          onChange={handleChange}
          placeholder="Company URL"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (e.g. Oct 2024 - Feb 2025)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <select
          name="section_type"
          value={form.section_type}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        >
          <option value="work">Work</option>
          <option value="internship">Internship</option>
          <option value="volunteer">Volunteer</option>
        </select>
        <input
          name="logo_path"
          value={form.logo_path}
          onChange={handleChange}
          placeholder="Logo filename (assets)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Color (#000)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8, minHeight: 80 }}
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            style={{ maxWidth: 120, display: "block" }}
          />
        )}
        <button type="submit">{editing ? "Update" : "Add"} Experience</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                role: "",
                title: "",
                company: "",
                company_url: "",
                start: "",
                end: "",
                duration: "",
                location: "",
                description: "",
                logo_path: "",
                section_type: "work",
                color: "#000",
                image: null,
              });
              setImagePreview(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <ul>
        {items.map((p) => (
          <li
            key={p.id}
            style={{
              marginBottom: 16,
              border: "1px solid #ccc",
              padding: 8,
              borderRadius: 6,
            }}
          >
            <strong>{p.title || p.role}</strong> at <strong>{p.company}</strong>{" "}
            ({p.duration || `${p.start} - ${p.end}`}) [{p.section_type}]<br />
            {p.image && <img src={p.image} alt="" style={{ maxWidth: 80 }} />}
            <br />
            <div>
              <b>Description:</b> {p.description}
            </div>
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
