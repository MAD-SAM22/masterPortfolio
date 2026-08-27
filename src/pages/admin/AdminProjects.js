import React, { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";

const API = "/api/projects";
const HEADER_API = "/api/projects-header";

export default function AdminProjects({ adminToken }) {
  const [projects, setProjects] = useState([]);
  const [header, setHeader] = useState({
    title: "Projects",
    description: "",
    avatar_image_path: "",
  });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    year: "",
    url: "",
    technologies: "",
    languages: "",
    content: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setProjects);
    fetch(HEADER_API)
      .then((res) => res.json())
      .then(
        (d) =>
          d &&
          setHeader({
            title: d.title || "Projects",
            description: d.description || "",
            avatar_image_path: d.avatar_image_path || "",
          })
      );
  }, []);

  const handleEdit = (p) => {
    setEditing(p.id);
    const langs =
      typeof p.languages === "string"
        ? p.languages
        : p.languages
        ? JSON.stringify(p.languages, null, 2)
        : "[]";
    setForm({ ...p, languages: langs, image: null });
    setImagePreview(p.image);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this project?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => setProjects(projects.filter((p) => p.id !== id)));
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

  const handleContentChange = (content) => {
    setForm((f) => ({ ...f, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    let languages = form.languages;
    try {
      if (languages) languages = JSON.parse(languages);
    } catch {}
    Object.entries({ ...form, languages }).forEach(([k, v]) => {
      if (v != null && v !== "" && k !== "image")
        data.append(k, typeof v === "object" ? JSON.stringify(v) : v);
    });
    if (form.image) data.append("image", form.image);
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
          name: "",
          description: "",
          year: "",
          url: "",
          technologies: "",
          languages: "",
          content: "",
          image: null,
        });
        setImagePreview(null);
        fetch(API)
          .then((r) => r.json())
          .then(setProjects);
      });
  };

  const saveHeader = (e) => {
    e.preventDefault();
    fetch(HEADER_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(header),
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <form
        onSubmit={saveHeader}
        style={{
          marginBottom: 32,
          padding: 20,
          background: "#f1f5f9",
          borderRadius: 12,
        }}
      >
        <h4 style={{ marginTop: 0, color: "#1e293b" }}>Page Header</h4>
        <input
          value={header.title}
          onChange={(e) => setHeader((h) => ({ ...h, title: e.target.value }))}
          placeholder="Title"
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />
        <textarea
          value={header.description}
          onChange={(e) =>
            setHeader((h) => ({ ...h, description: e.target.value }))
          }
          placeholder="Description"
          rows={2}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#1e293b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Save Header
        </button>
      </form>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 40,
          padding: 24,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 20 }}>
          {editing ? "Edit Project" : "Add New Project"}
        </h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Year"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          />
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="URL"
            style={{
              flex: 2,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          />
        </div>
        <input
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="Technologies (e.g. React, Node.js, MongoDB)"
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />
        <textarea
          name="languages"
          value={form.languages}
          onChange={handleChange}
          placeholder="Languages JSON (Optional)"
          rows={2}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            fontFamily: "monospace",
          }}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Summary Description"
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "600",
            color: "#475569",
          }}
        >
          Project Blog Content
        </label>
        <RichTextEditor
          value={form.content}
          onChange={handleContentChange}
          placeholder="Write detailed content about this project..."
        />

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Project Image
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ marginBottom: 12 }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              style={{
                maxWidth: 200,
                borderRadius: 8,
                display: "block",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {editing ? "Update Project" : "Add Project"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  name: "",
                  description: "",
                  year: "",
                  url: "",
                  technologies: "",
                  languages: "",
                  content: "",
                  image: null,
                });
                setImagePreview(null);
              }}
              style={{
                padding: "12px 24px",
                background: "#94a3b8",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <h4 style={{ margin: 0, color: "#1e293b" }}>{p.name}</h4>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  fontWeight: "600",
                }}
              >
                {p.year}
              </span>
            </div>
            {p.image && (
              <img
                src={p.image}
                alt=""
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              />
            )}
            <p
              style={{ fontSize: "0.9rem", color: "#475569", marginBottom: 12 }}
            >
              {p.description}
            </p>
            {p.content && (
              <div style={{ marginBottom: 12 }}>
                <b
                  style={{
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                  }}
                >
                  Content Preview:
                </b>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    maxHeight: 60,
                    overflow: "hidden",
                    borderLeft: "3px solid #e2e8f0",
                    paddingLeft: 10,
                    marginTop: 4,
                  }}
                  dangerouslySetInnerHTML={{ __html: p.content }}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => handleEdit(p)}
                style={{
                  flex: 1,
                  padding: "6px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  flex: 1,
                  padding: "6px",
                  background: "#fee2e2",
                  color: "#ef4444",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
