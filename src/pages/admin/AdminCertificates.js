import React, { useState, useEffect } from "react";

const API = "/api/certificates";

export default function AdminCertificates({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    subtitle: "",
    date: "",
    url: "",
    certificate_link: "",
    description: "",
    logo_path: "",
    alt_name: "",
    color_code: "#333",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      title: p.title,
      issuer: p.issuer,
      subtitle: p.subtitle,
      date: p.date,
      url: p.url,
      certificate_link: p.certificate_link || p.url,
      description: p.description,
      logo_path: p.logo_path,
      alt_name: p.alt_name,
      color_code: p.color_code || "#333",
      image: null,
    });
    setImagePreview(
      p.image && p.image.startsWith("/")
        ? p.image
        : p.logo_path
        ? null
        : p.image
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this certificate?")) return;
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
      .then(() => window.location.reload());
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>Certificates Admin</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="issuer"
          value={form.issuer}
          onChange={handleChange}
          placeholder="Issuer"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Subtitle (e.g. - ITI)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Date"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="certificate_link"
          value={form.certificate_link}
          onChange={handleChange}
          placeholder="Certificate URL"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="URL (fallback)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="logo_path"
          value={form.logo_path}
          onChange={handleChange}
          placeholder="Logo filename (assets)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="alt_name"
          value={form.alt_name}
          onChange={handleChange}
          placeholder="Alt name"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          name="color_code"
          value={form.color_code}
          onChange={handleChange}
          placeholder="Color code (#333)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
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
        <button type="submit">{editing ? "Update" : "Add"} Certificate</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                title: "",
                issuer: "",
                subtitle: "",
                date: "",
                url: "",
                certificate_link: "",
                description: "",
                logo_path: "",
                alt_name: "",
                color_code: "#333",
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
            <strong>{p.title}</strong> ({p.issuer}, {p.date})<br />
            {p.image && <img src={p.image} alt="" style={{ maxWidth: 80 }} />}
            <br />
            <div>
              <b>Description:</b> {p.description}
            </div>
            <em>{p.url}</em>
            <br />
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
