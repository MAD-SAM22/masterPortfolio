import React, { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";

const API = "/api/research";

export default function AdminResearch({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    date: "",
    url: "",
    content: "",
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
    setForm({ ...p, image: null });
    setImagePreview(p.image);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this research?")) return;
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

  const handleContentChange = (content) => {
    setForm((f) => ({ ...f, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v != null && v !== "" && k !== "image") data.append(k, v);
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
          title: "",
          abstract: "",
          date: "",
          url: "",
          content: "",
          image: null,
        });
        setImagePreview(null);
        fetch("/api/research")
          .then((res) => res.json())
          .then(setItems);
      });
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
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
          {editing ? "Edit Research/Blog" : "Add New Research/Blog"}
        </h3>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
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
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="Date (e.g. Oct 2025)"
            required
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
            placeholder="Research URL (Optional)"
            style={{
              flex: 2,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <textarea
          name="abstract"
          value={form.abstract}
          onChange={handleChange}
          placeholder="Abstract / Summary"
          required
          rows={3}
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
          Detailed Blog Content
        </label>
        <RichTextEditor
          value={form.content}
          onChange={handleContentChange}
          placeholder="Write the full blog post here..."
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
            Feature Image
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
              style={{ maxWidth: 200, borderRadius: 8, display: "block" }}
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
            {editing ? "Update" : "Add"} Entry
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  title: "",
                  abstract: "",
                  date: "",
                  url: "",
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

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #e2e8f0",
              padding: 20,
              borderRadius: 12,
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>
                  {p.title}
                </h4>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: 8,
                  }}
                >
                  {p.date} •{" "}
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3b82f6" }}
                  >
                    View Link
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    padding: "4px 12px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "4px 12px",
                    background: "#fee2e2",
                    color: "#ef4444",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#475569",
                    marginBottom: 8,
                  }}
                >
                  <b>Abstract:</b> {p.abstract}
                </div>
                {p.content && (
                  <div>
                    <b style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      BLOG PREVIEW:
                    </b>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        maxHeight: 50,
                        overflow: "hidden",
                        borderLeft: "3px solid #e2e8f0",
                        paddingLeft: 10,
                      }}
                      dangerouslySetInnerHTML={{ __html: p.content }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
