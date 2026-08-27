import React, { useState, useEffect } from "react";

const API = "/api/site-details";

export default function AdminSiteDetails({ adminToken }) {
  const [form, setForm] = useState({ bio: "", skills: "", contact: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        if (data)
          setForm({
            bio: data.bio || "",
            skills: data.skills || "",
            contact: data.contact || "",
          });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        setMsg("Settings updated successfully!");
        setTimeout(() => setMsg(""), 3000);
      });
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 24,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Global Site Settings</h3>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Short Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Summary of yourself for the landing page"
            rows={4}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Skills Overview
          </label>
          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="List your key skills"
            rows={2}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Contact Summary
          </label>
          <textarea
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Email, location, or other contact highlights"
            rows={2}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            type="submit"
            style={{
              padding: "12px 32px",
              background: "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
            }}
          >
            Save Changes
          </button>
          {msg && (
            <span style={{ color: "#10b981", fontWeight: "600" }}>{msg}</span>
          )}
        </div>
      </form>
    </div>
  );
}
