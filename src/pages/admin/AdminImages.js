import React, { useState, useEffect } from "react";

const API = "/api/images";

export default function AdminImages({ adminToken }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: "", alt: "", file: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this image?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => setItems(items.filter((p) => p.id !== id)));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
    fetch(API, {
      method: "POST",
      headers: { "x-admin-token": adminToken },
      body: data,
    })
      .then((res) => res.json())
      .then(() => window.location.reload());
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
          background: "#f8fafc",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 20 }}>Upload Media Asset</h3>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Asset Type (e.g. project, avatar)"
            required
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          />
          <input
            name="alt"
            value={form.alt}
            onChange={handleChange}
            placeholder="Alt Description"
            required
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <input
            name="file"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
            style={{ marginBottom: 12 }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              style={{
                maxWidth: 160,
                borderRadius: 8,
                display: "block",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            background: "#1e293b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          Upload to Server
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 20,
        }}
      >
        {items.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              padding: 12,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            {p.filename && (
              <img
                src={p.filename}
                alt={p.alt}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "contain",
                  borderRadius: 6,
                  marginBottom: 12,
                  background: "#f1f5f9",
                }}
              />
            )}
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: 4,
              }}
            >
              {p.type}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginBottom: 12,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {p.alt}
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              style={{
                width: "100%",
                padding: "6px",
                background: "#fee2e2",
                color: "#ef4444",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: "700",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
