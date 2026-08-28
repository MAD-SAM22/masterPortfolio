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
    alt_name: "",
    color_code: "#333",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const refreshItems = () => {
    fetch(API)
      .then((r) => r.json())
      .then(setItems);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      title: p.title || "",
      issuer: p.issuer || "",
      subtitle: p.subtitle || "",
      date: p.date || "",
      url: p.url || "",
      certificate_link: p.certificate_link || p.url || "",
      description: p.description || "",
      alt_name: p.alt_name || "",
      color_code: p.color_code || "#333",
    });
    setLogoFile(null);
    const img = p.image || p.logo_path || "";
    setLogoPreview(img ? (img.startsWith("/") ? img : `/uploads/${img}`) : "");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => refreshItems());
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
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v != null && v !== "") data.append(k, v);
    });
    if (logoFile) data.append("logo_path", logoFile);
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
          issuer: "",
          subtitle: "",
          date: "",
          url: "",
          certificate_link: "",
          description: "",
          alt_name: "",
          color_code: "#333",
        });
        setLogoFile(null);
        setLogoPreview("");
        refreshItems();
      });
  };

  return (
    <Section>
      <FormCard as="form" onSubmit={handleSubmit}>
        <SectionTitle>
          {editing ? "Edit Certificate" : "Add Certificate"}
        </SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Django Framework"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Issuer</Label>
            <Input
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              placeholder="e.g. ITI"
            />
          </FormGroup>
          <FormGroup>
            <Label>Subtitle</Label>
            <Input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="e.g. - ITI"
            />
          </FormGroup>
          <FormGroup>
            <Label>Date</Label>
            <Input
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="e.g. Oct 2025"
            />
          </FormGroup>
          <FormGroup>
            <Label>Certificate URL</Label>
            <Input
              name="certificate_link"
              value={form.certificate_link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </FormGroup>
          <FormGroup>
            <Label>Alt Name</Label>
            <Input
              name="alt_name"
              value={form.alt_name}
              onChange={handleChange}
              placeholder="Alt text for logo"
            />
          </FormGroup>
          <FormGroup>
            <Label>Color Code</Label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                name="color_code"
                value={form.color_code}
                onChange={handleChange}
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              />
              <Input
                name="color_code"
                value={form.color_code}
                onChange={handleChange}
                placeholder="#333"
              />
            </div>
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Description</Label>
          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Certificate description"
          />
        </FormGroup>

        <FormGroup>
          <Label>Logo / Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: "none" }}
            id="cert-logo-upload"
          />
          <label htmlFor="cert-logo-upload" style={{ cursor: "pointer" }}>
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
                    Click to upload image
                  </div>
                </div>
              )}
            </UploadArea>
          </label>
        </FormGroup>

        <BtnGroup>
          <BtnPrimary type="submit">
            {editing ? "Update" : "Add"} Certificate
          </BtnPrimary>
          {editing && (
            <BtnGhost
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
                  alt_name: "",
                  color_code: "#333",
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
        {items.map((p) => {
          const img = p.image || p.logo_path || "";
          return (
            <ItemCard key={p.id}>
              <ItemCardBody>
                <ItemCardHeader>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <LogoPreview src={img} alt={p.alt_name} size={48} />
                    <div>
                      <ItemCardTitle>{p.title}</ItemCardTitle>
                      <ItemCardMeta>
                        {p.issuer} {p.date && `• ${p.date}`}
                      </ItemCardMeta>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <BtnGhost onClick={() => handleEdit(p)}>Edit</BtnGhost>
                    <BtnDanger onClick={() => handleDelete(p.id)}>
                      Delete
                    </BtnDanger>
                  </div>
                </ItemCardHeader>
                {p.description && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#475569",
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.description}
                  </div>
                )}
              </ItemCardBody>
            </ItemCard>
          );
        })}
      </div>
    </Section>
  );
}
