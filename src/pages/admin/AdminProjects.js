import React, { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
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
  BtnSmall,
  BtnGroup,
  ItemCard,
  ItemCardBody,
  ItemCardHeader,
  ItemCardTitle,
  ItemCardMeta,
  UploadArea,
} from "./adminStyles";

const API = "/api/projects";
const HEADER_API = "/api/projects-header";

function parseImages(p) {
  if (p.images && Array.isArray(p.images)) {
    return p.images.map((img) =>
      img && !img.startsWith("/") ? `/uploads/${img}` : img
    );
  }
  if (p.image) {
    try {
      const arr = JSON.parse(p.image);
      return Array.isArray(arr)
        ? arr.map((img) =>
            img && !img.startsWith("/") ? `/uploads/${img}` : img
          )
        : [p.image.startsWith("/") ? p.image : `/uploads/${p.image}`];
    } catch {
      return [p.image.startsWith("/") ? p.image : `/uploads/${p.image}`];
    }
  }
  return [];
}

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
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const refreshProjects = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.map((p) => ({ ...p, images: parseImages(p) })));
      });
  };

  useEffect(() => {
    refreshProjects();
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
    setForm({
      name: p.name || "",
      description: p.description || "",
      year: p.year || "",
      url: p.url || "",
      technologies: p.technologies || "",
      languages: langs,
      content: p.content || "",
    });
    setExistingImages(p.images || []);
    setNewFiles([]);
    setNewPreviews([]);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this project?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => refreshProjects());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleContentChange = (content) => {
    setForm((f) => ({ ...f, content }));
  };

  const handleFilesAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from, to) => {
    const allPreviews = [...existingImages, ...newPreviews];
    if (to < 0 || to >= allPreviews.length) return;
    const updated = [...allPreviews];
    const item = updated.splice(from, 1)[0];
    updated.splice(to, 0, item);
    const exCount = existingImages.length;
    setExistingImages(updated.slice(0, exCount));
    setNewPreviews(updated.slice(exCount));
    const allFiles = [...existingImages.map(() => null), ...newFiles];
    const filesUpdated = [...allFiles];
    const movedFile = filesUpdated.splice(from, 1)[0];
    filesUpdated.splice(to, 0, movedFile);
    setNewFiles(filesUpdated.slice(exCount));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    let languages = form.languages;
    try {
      if (languages) languages = JSON.parse(languages);
    } catch {}
    Object.entries({ ...form, languages }).forEach(([k, v]) => {
      if (v != null && v !== "")
        data.append(k, typeof v === "object" ? JSON.stringify(v) : v);
    });
    data.append("existingImages", JSON.stringify(existingImages));
    newFiles.forEach((f) => data.append("images", f));
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
        });
        setExistingImages([]);
        setNewFiles([]);
        setNewPreviews([]);
        refreshProjects();
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

  const allPreviews = [...existingImages, ...newPreviews];
  const totalCount = allPreviews.length;

  return (
    <Section>
      <SectionTitle>Page Header</SectionTitle>
      <FormCard as="form" onSubmit={saveHeader}>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={header.title}
              onChange={(e) =>
                setHeader((h) => ({ ...h, title: e.target.value }))
              }
              placeholder="e.g. Projects"
            />
          </FormGroup>
          <FormGroup>
            <Label>Avatar Image</Label>
            <Input
              value={header.avatar_image_path}
              onChange={(e) =>
                setHeader((h) => ({
                  ...h,
                  avatar_image_path: e.target.value,
                }))
              }
              placeholder="e.g. projects_image.svg"
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Description</Label>
          <TextArea
            value={header.description}
            onChange={(e) =>
              setHeader((h) => ({ ...h, description: e.target.value }))
            }
            placeholder="Projects page description"
          />
        </FormGroup>
        <BtnGroup>
          <BtnPrimary type="submit">Save Header</BtnPrimary>
        </BtnGroup>
      </FormCard>

      <SectionTitle>{editing ? "Edit Project" : "Add Project"}</SectionTitle>
      <FormCard as="form" onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label>Project Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Master Portfolio"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Year</Label>
            <Input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="e.g. 2025"
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>URL</Label>
          <Input
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </FormGroup>
        <FormGroup>
          <Label>Technologies</Label>
          <Input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
          />
        </FormGroup>
        <FormGroup>
          <Label>Languages JSON (Optional)</Label>
          <TextArea
            name="languages"
            value={form.languages}
            onChange={handleChange}
            placeholder='[{"id": "javascript", "text": "JavaScript"}]'
            style={{
              minHeight: 60,
              fontFamily: "monospace",
              fontSize: "0.85rem",
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Summary Description</Label>
          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief project description"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Detailed Blog Content</Label>
          <RichTextEditor
            value={form.content}
            onChange={handleContentChange}
            placeholder="Write detailed content about this project..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Project Images ({totalCount} added)</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesAdd}
            style={{ display: "none" }}
            id="project-images-upload"
          />
          <label htmlFor="project-images-upload" style={{ cursor: "pointer" }}>
            <UploadArea>
              <div style={{ color: "#94a3b8" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>+</div>
                <div style={{ fontSize: "0.8rem" }}>Click to add images</div>
                <div style={{ fontSize: "0.7rem", marginTop: 2 }}>
                  You can select multiple files
                </div>
              </div>
            </UploadArea>
          </label>
          {totalCount > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 10,
                marginTop: 12,
              }}
            >
              {allPreviews.map((src, i) => {
                const isExisting = i < existingImages.length;
                return (
                  <div
                    key={`${isExisting ? "ex" : "new"}-${i}`}
                    style={{
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "2px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{
                        width: "100%",
                        height: 110,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 4,
                        padding: "4px 2px",
                        background: "#fff",
                      }}
                    >
                      {i > 0 && (
                        <BtnSmall
                          type="button"
                          onClick={() => moveImage(i, i - 1)}
                        >
                          &#9664;
                        </BtnSmall>
                      )}
                      {i < totalCount - 1 && (
                        <BtnSmall
                          type="button"
                          onClick={() => moveImage(i, i + 1)}
                        >
                          &#9654;
                        </BtnSmall>
                      )}
                      <BtnSmall
                        type="button"
                        onClick={() =>
                          isExisting
                            ? removeExistingImage(i)
                            : removeNewImage(i - existingImages.length)
                        }
                        style={{ color: "#ef4444" }}
                      >
                        &#10005;
                      </BtnSmall>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        background: isExisting ? "#3b82f6" : "#10b981",
                        color: "#fff",
                        fontSize: "0.6rem",
                        padding: "1px 5px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      {isExisting ? "Saved" : "New"}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        fontSize: "0.6rem",
                        padding: "1px 5px",
                        borderRadius: 4,
                      }}
                    >
                      {i + 1}/{totalCount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </FormGroup>

        <BtnGroup>
          <BtnPrimary type="submit">
            {editing ? "Update" : "Add"} Project
          </BtnPrimary>
          {editing && (
            <BtnGhost
              type="button"
              onClick={() => {
                newPreviews.forEach((u) => URL.revokeObjectURL(u));
                setEditing(null);
                setForm({
                  name: "",
                  description: "",
                  year: "",
                  url: "",
                  technologies: "",
                  languages: "",
                  content: "",
                });
                setExistingImages([]);
                setNewFiles([]);
                setNewPreviews([]);
              }}
            >
              Cancel
            </BtnGhost>
          )}
        </BtnGroup>
      </FormCard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {projects.map((p) => (
          <ItemCard key={p.id}>
            {p.images && p.images.length > 0 ? (
              <div style={{ display: "flex", overflow: "hidden" }}>
                {p.images.slice(0, 2).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    style={{
                      width: p.images.length === 1 ? "100%" : "50%",
                      height: 140,
                      objectFit: "cover",
                      borderRight:
                        i === 0 && p.images.length > 1
                          ? "1px solid #fff"
                          : "none",
                    }}
                  />
                ))}
                {p.images.length > 2 && (
                  <div
                    style={{
                      width: "50%",
                      height: 140,
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    +{p.images.length - 2}
                  </div>
                )}
              </div>
            ) : null}
            <ItemCardBody>
              <ItemCardHeader>
                <ItemCardTitle>{p.name}</ItemCardTitle>
                <ItemCardMeta>
                  {p.year}
                  {p.images && p.images.length > 1 && (
                    <span> • {p.images.length} images</span>
                  )}
                </ItemCardMeta>
              </ItemCardHeader>
              {p.description && (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#475569",
                    marginBottom: 12,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.description}
                </div>
              )}
              {p.technologies && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  {p.technologies
                    .split(",")
                    .slice(0, 4)
                    .map((t, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "2px 8px",
                          background: "#f1f5f9",
                          borderRadius: 12,
                          fontSize: "0.75rem",
                          color: "#475569",
                        }}
                      >
                        {t.trim()}
                      </span>
                    ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <BtnGhost onClick={() => handleEdit(p)}>Edit</BtnGhost>
                <BtnDanger onClick={() => handleDelete(p.id)}>Delete</BtnDanger>
              </div>
            </ItemCardBody>
          </ItemCard>
        ))}
      </div>
    </Section>
  );
}
