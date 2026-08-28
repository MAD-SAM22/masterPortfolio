import React, { useState, useEffect } from "react";
import {
  Section,
  SectionTitle,
  FormCard,
  FormGrid,
  FormGroup,
  Label,
  Input,
  BtnPrimary,
  BtnDanger,
  BtnGhost,
  BtnGroup,
  ItemCard,
  ItemCardBody,
  ItemCardHeader,
  ItemCardTitle,
  ItemCardMeta,
} from "./adminStyles";

const API = "/api/competitive-sites";

export default function AdminCompetitiveSites({ adminToken }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    siteName: "",
    iconifyClassname: "",
    style: "{}",
    profileLink: "",
  });

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const handleEdit = (c) => {
    setEditing(c.id);
    setForm({
      siteName: c.siteName || "",
      iconifyClassname: c.iconifyClassname || "",
      style:
        typeof c.style === "object" ? JSON.stringify(c.style) : c.style || "{}",
      profileLink: c.profileLink || "",
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this site?")) return;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() => setItems(items.filter((i) => i.id !== id)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let style = {};
    try {
      style = JSON.parse(form.style || "{}");
    } catch {}
    const payload = { ...form, style };
    const url = editing ? `${API}/${editing}` : API;
    const method = editing ? "PUT" : "POST";
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(payload),
    }).then(() => {
      fetch(API)
        .then((r) => r.json())
        .then(setItems);
      setEditing(null);
      setForm({
        siteName: "",
        iconifyClassname: "",
        style: "{}",
        profileLink: "",
      });
    });
  };

  const getIconStyle = (style) => {
    if (typeof style === "string") {
      try {
        style = JSON.parse(style);
      } catch {
        return {};
      }
    }
    return style || {};
  };

  return (
    <Section>
      <FormCard as="form" onSubmit={handleSubmit}>
        <SectionTitle>{editing ? "Edit Site" : "Add Site"}</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Site Name</Label>
            <Input
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              placeholder="e.g. LeetCode"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Profile URL</Label>
            <Input
              name="profileLink"
              value={form.profileLink}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Iconify Class</Label>
            <Input
              name="iconifyClassname"
              value={form.iconifyClassname}
              onChange={handleChange}
              placeholder="e.g. simple-icons:leetcode"
            />
          </FormGroup>
          <FormGroup>
            <Label>Style JSON</Label>
            <Input
              name="style"
              value={form.style}
              onChange={handleChange}
              placeholder='{"color":"#F79F1B"}'
            />
          </FormGroup>
        </FormGrid>
        <BtnGroup>
          <BtnPrimary type="submit">
            {editing ? "Update" : "Add"} Site
          </BtnPrimary>
          {editing && (
            <BtnGhost
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  siteName: "",
                  iconifyClassname: "",
                  style: "{}",
                  profileLink: "",
                });
              }}
            >
              Cancel
            </BtnGhost>
          )}
        </BtnGroup>
      </FormCard>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((c) => (
          <ItemCard key={c.id}>
            <ItemCardBody>
              <ItemCardHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: getIconStyle(c.style).color || "#f1f5f9",
                      fontSize: "1.2rem",
                    }}
                  >
                    {c.iconifyClassname ? (
                      <span
                        className="iconify"
                        data-icon={c.iconifyClassname}
                        style={{ color: "#fff" }}
                      />
                    ) : (
                      c.siteName?.charAt(0)
                    )}
                  </div>
                  <div>
                    <ItemCardTitle>{c.siteName}</ItemCardTitle>
                    <ItemCardMeta>
                      <a
                        href={c.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6" }}
                      >
                        View Profile
                      </a>
                    </ItemCardMeta>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <BtnGhost onClick={() => handleEdit(c)}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(c.id)}>
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
