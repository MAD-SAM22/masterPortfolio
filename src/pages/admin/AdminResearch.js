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

const API = "/api/research";

function parseImages(r) {
  if (r.images && Array.isArray(r.images)) {
    return r.images.map((img) =>
      img && !img.startsWith("/") ? `/uploads/${img}` : img
    );
  }
  if (r.image) {
    try {
      const arr = JSON.parse(r.image);
      return Array.isArray(arr)
        ? arr.map((img) =>
            img && !img.startsWith("/") ? `/uploads/${img}` : img
          )
        : [r.image.startsWith("/") ? r.image : `/uploads/${r.image}`];
    } catch {
      return [r.image.startsWith("/") ? r.image : `/uploads/${r.image}`];
    }
  }
  return [];
}

export default function AdminResearch({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    date: "",
    url: "",
    content: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const refreshItems = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.map((r) => ({ ...r, images: parseImages(r) })));
      });
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      title: p.title || "",
      abstract: p.abstract || "",
      date: p.date || "",
      url: p.url || "",
      content: p.content || "",
    });
    setExistingImages(p.images || []);
    setNewFiles([]);
    setNewPreviews([]);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this research?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => setItems(items.filter((p) => p.id !== id)));
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
    const item = allPreviews[from];
    const updated = [...allPreviews];
    updated.splice(from, 1);
    updated.splice(to, 0, item);
    const exCount = existingImages.length;
    setExistingImages(updated.slice(0, exCount));
    const newPart = updated.slice(exCount);
    setNewPreviews(newPart);
    // keep newFiles in sync: nulls for existing, real files for new
    const allFiles = [...existingImages.map(() => null), ...newFiles];
    const movedFile = allFiles[from];
    const filesUpdated = [...allFiles];
    filesUpdated.splice(from, 1);
    filesUpdated.splice(to, 0, movedFile);
    setNewFiles(filesUpdated.slice(exCount));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v != null) data.append(k, v);
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
        setForm({ title: "", abstract: "", date: "", url: "", content: "" });
        setExistingImages([]);
        setNewFiles([]);
        setNewPreviews([]);
        refreshItems();
      });
  };

  const allPreviews = [...existingImages, ...newPreviews];
  const totalCount = allPreviews.length;

  return (
    <Section>
      <SectionTitle>
        {editing ? "Edit Research / Blog" : "Add Research / Blog"}
      </SectionTitle>
      <FormCard as="form" onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Research Paper Title"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Date</Label>
            <Input
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="e.g. Oct 2025"
              required
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
          <Label>Abstract / Summary</Label>
          <TextArea
            name="abstract"
            value={form.abstract}
            onChange={handleChange}
            placeholder="Brief abstract of the research"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Detailed Blog Content</Label>
          <RichTextEditor
            value={form.content}
            onChange={handleContentChange}
            placeholder="Write the full blog post here..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Blog Images ({totalCount} added)</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesAdd}
            style={{ display: "none" }}
            id="research-images-upload"
          />
          <label htmlFor="research-images-upload" style={{ cursor: "pointer" }}>
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
            {editing ? "Update" : "Add"} Entry
          </BtnPrimary>
          {editing && (
            <BtnGhost
              type="button"
              onClick={() => {
                newPreviews.forEach((u) => URL.revokeObjectURL(u));
                setEditing(null);
                setForm({
                  title: "",
                  abstract: "",
                  date: "",
                  url: "",
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

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((p) => (
          <ItemCard key={p.id}>
            <ItemCardBody>
              <ItemCardHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {p.images && p.images.length > 0 ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      {p.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      ))}
                      {p.images.length > 3 && (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 6,
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          +{p.images.length - 3}
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div>
                    <ItemCardTitle>{p.title}</ItemCardTitle>
                    <ItemCardMeta>
                      {p.date}
                      {p.images && p.images.length > 0 && (
                        <span>
                          {" "}
                          • {p.images.length} image
                          {p.images.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {p.url && (
                        <>
                          {" • "}
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#3b82f6" }}
                          >
                            View Link
                          </a>
                        </>
                      )}
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
              {p.abstract && (
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
                  <b>Abstract:</b> {p.abstract}
                </div>
              )}
            </ItemCardBody>
          </ItemCard>
        ))}
      </div>
    </Section>
  );
}
