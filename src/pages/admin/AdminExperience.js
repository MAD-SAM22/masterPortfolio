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
  Select,
  BtnPrimary,
  BtnDanger,
  BtnGhost,
  BtnGroup,
  ItemCard,
  ItemCardBody,
  ItemCardHeader,
  ItemCardTitle,
  ItemCardMeta,
  Badge,
  LogoPreview,
  ImageUpload,
  UploadArea,
} from "./adminStyles";

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
    section_type: "work",
    color: "#000",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

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
      role: p.role || p.title || "",
      title: p.title || p.role || "",
      company: p.company || "",
      company_url: p.company_url || "",
      start: p.start || "",
      end: p.end || "",
      duration: p.duration || "",
      location: p.location || "",
      description: p.description || "",
      section_type: p.section_type || "work",
      color: p.color || "#000",
    });
    setImagePreview(p.image && p.image.startsWith("/") ? p.image : null);
    setLogoFile(null);
    setLogoPreview(
      p.logo_path
        ? p.logo_path.startsWith("/")
          ? p.logo_path
          : `/uploads/${p.logo_path}`
        : ""
    );
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
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
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
          role: "",
          title: "",
          company: "",
          company_url: "",
          start: "",
          end: "",
          duration: "",
          location: "",
          description: "",
          section_type: "work",
          color: "#000",
        });
        setImagePreview(null);
        setLogoFile(null);
        setLogoPreview("");
        fetch(API)
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

  const typeColors = {
    work: { bg: "#dbeafe", color: "#2563eb" },
    internship: { bg: "#fef3c7", color: "#d97706" },
    volunteer: { bg: "#d1fae5", color: "#059669" },
  };

  return (
    <Section>
      <SectionTitle>Page Header</SectionTitle>
      <FormCard as="form" onSubmit={saveMeta}>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={meta.title}
              onChange={(e) =>
                setMeta((m) => ({ ...m, title: e.target.value }))
              }
              placeholder="e.g. Experience"
            />
          </FormGroup>
          <FormGroup>
            <Label>Subtitle</Label>
            <Input
              value={meta.subtitle}
              onChange={(e) =>
                setMeta((m) => ({ ...m, subtitle: e.target.value }))
              }
              placeholder="e.g. Work, Internship and Volunteership"
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Description</Label>
          <TextArea
            value={meta.description}
            onChange={(e) =>
              setMeta((m) => ({ ...m, description: e.target.value }))
            }
            placeholder="Page header description"
          />
        </FormGroup>
        <BtnGroup>
          <BtnPrimary type="submit">Save Header</BtnPrimary>
        </BtnGroup>
      </FormCard>

      <SectionTitle>
        {editing ? "Edit Experience" : "Add Experience"}
      </SectionTitle>
      <FormCard as="form" onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label>Title / Role</Label>
            <Input
              name="title"
              value={form.title || form.role}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => ({ ...f, title: v, role: v }));
              }}
              placeholder="e.g. Web Developer"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Company</Label>
            <Input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. AiTech"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Company URL</Label>
            <Input
              name="company_url"
              value={form.company_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </FormGroup>
          <FormGroup>
            <Label>Duration</Label>
            <Input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. Oct 2024 - Feb 2025"
            />
          </FormGroup>
          <FormGroup>
            <Label>Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Cairo, Egypt"
            />
          </FormGroup>
          <FormGroup>
            <Label>Section Type</Label>
            <Select
              name="section_type"
              value={form.section_type}
              onChange={handleChange}
            >
              <option value="work">Work</option>
              <option value="internship">Internship</option>
              <option value="volunteer">Volunteer</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Logo</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: "none" }}
              id="exp-logo-upload"
            />
            <label htmlFor="exp-logo-upload" style={{ cursor: "pointer" }}>
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
            <Label>Color</Label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                name="color"
                value={form.color}
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
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="#000"
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
            placeholder="Describe your role and achievements"
            required
          />
        </FormGroup>
        <ImageUpload
          name="image"
          onChange={handleChange}
          preview={imagePreview}
          label="Company Logo"
        />
        <BtnGroup>
          <BtnPrimary type="submit">
            {editing ? "Update" : "Add"} Experience
          </BtnPrimary>
          {editing && (
            <BtnGhost
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
                  section_type: "work",
                  color: "#000",
                });
                setImagePreview(null);
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
          const tc = typeColors[p.section_type] || typeColors.work;
          return (
            <ItemCard key={p.id}>
              <ItemCardBody>
                <ItemCardHeader>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <LogoPreview src={p.logo_path} alt={p.company} size={48} />
                    <div>
                      <ItemCardTitle>
                        {p.title || p.role} at {p.company}
                      </ItemCardTitle>
                      <ItemCardMeta>
                        {p.duration || `${p.start} - ${p.end}`}
                        {p.location && ` • ${p.location}`}
                      </ItemCardMeta>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Badge bg={tc.bg} color={tc.color}>
                      {p.section_type}
                    </Badge>
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
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.description}
                  </div>
                )}
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}
              </ItemCardBody>
            </ItemCard>
          );
        })}
      </div>
    </Section>
  );
}
