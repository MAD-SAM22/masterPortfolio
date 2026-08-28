import React, { useState, useEffect } from "react";
import {
  Section,
  SectionTitle,
  FormCard,
  FormGrid,
  FormGroup,
  Label,
  Input,
  TextArea,
  BtnPrimary,
  BtnDanger,
  BtnGhost,
  BtnGroup,
  ItemCard,
  ItemCardBody,
  ItemCardHeader,
  ItemCardTitle,
  ItemCardMeta,
  LogoPreview,
  UploadArea,
} from "./adminStyles";

const API = "/api/degrees";

export default function AdminDegrees({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    alt_name: "",
    duration: "",
    descriptions: "[]",
    website_link: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

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
      alt_name: d.alt_name || "",
      duration: d.duration || "",
      descriptions: Array.isArray(d.descriptions)
        ? JSON.stringify(d.descriptions, null, 2)
        : d.descriptions || "[]",
      website_link: d.website_link || "",
    });
    setLogoFile(null);
    setLogoPreview(
      d.logo_path
        ? d.logo_path.startsWith("/")
          ? d.logo_path
          : `/uploads/${d.logo_path}`
        : ""
    );
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let descriptions = [];
    try {
      descriptions = JSON.parse(form.descriptions || "[]");
    } catch {}
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("descriptions", JSON.stringify(descriptions));
    if (logoFile) fd.append("logo_path", logoFile);

    const url = editing ? `${API}/${editing}` : API;
    const method = editing ? "PUT" : "POST";
    fetch(url, {
      method,
      headers: { "x-admin-token": adminToken },
      body: fd,
    }).then(() => {
      fetch(API)
        .then((r) => r.json())
        .then(setItems);
      setEditing(null);
      setForm({
        title: "",
        subtitle: "",
        alt_name: "",
        duration: "",
        descriptions: "[]",
        website_link: "",
      });
      setLogoFile(null);
      setLogoPreview("");
    });
  };

  return (
    <Section>
      <FormCard as="form" onSubmit={handleSubmit}>
        <SectionTitle>{editing ? "Edit Degree" : "Add Degree"}</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Information Technology Institute"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Subtitle</Label>
            <Input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="e.g. Diploma in Mobile Development"
            />
          </FormGroup>
          <FormGroup>
            <Label>Duration</Label>
            <Input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 2024 - 2025"
            />
          </FormGroup>
          <FormGroup>
            <Label>Alt Name</Label>
            <Input
              name="alt_name"
              value={form.alt_name}
              onChange={handleChange}
              placeholder="e.g. ITI"
            />
          </FormGroup>
        </FormGrid>
        <FormGrid>
          <FormGroup>
            <Label>Logo</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: "none" }}
              id="degree-logo-upload"
            />
            <label htmlFor="degree-logo-upload" style={{ cursor: "pointer" }}>
              <UploadArea>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    style={{
                      maxWidth: 200,
                      maxHeight: 120,
                      borderRadius: 8,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div style={{ color: "#94a3b8" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>+</div>
                    <div style={{ fontSize: "0.8rem" }}>
                      Click to upload logo
                    </div>
                  </div>
                )}
              </UploadArea>
            </label>
          </FormGroup>
          <FormGroup>
            <Label>Website URL</Label>
            <Input
              name="website_link"
              value={form.website_link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Descriptions (JSON Array)</Label>
          <TextArea
            name="descriptions"
            value={form.descriptions}
            onChange={handleChange}
            placeholder='["Point 1", "Point 2"]'
            style={{
              minHeight: 100,
              fontFamily: "monospace",
              fontSize: "0.85rem",
            }}
          />
        </FormGroup>
        <BtnGroup>
          <BtnPrimary type="submit">
            {editing ? "Update" : "Add"} Degree
          </BtnPrimary>
          {editing && (
            <BtnGhost
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  title: "",
                  subtitle: "",
                  alt_name: "",
                  duration: "",
                  descriptions: "[]",
                  website_link: "",
                });
                setLogoFile(null);
                setLogoPreview("");
              }}
            >
              Cancel
            </BtnGhost>
          )}
        </BtnGroup>
      </FormCard>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((d) => (
          <ItemCard key={d.id}>
            <ItemCardBody>
              <ItemCardHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <LogoPreview src={d.logo_path} alt={d.alt_name} size={48} />
                  <div>
                    <ItemCardTitle>{d.title}</ItemCardTitle>
                    <ItemCardMeta>
                      {d.subtitle} {d.duration && `• ${d.duration}`}
                    </ItemCardMeta>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <BtnGhost onClick={() => handleEdit(d)}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(d.id)}>
                    Delete
                  </BtnDanger>
                </div>
              </ItemCardHeader>
            </ItemCardBody>
          </ItemCard>
        ))}
      </div>
    </Section>
  );
}
