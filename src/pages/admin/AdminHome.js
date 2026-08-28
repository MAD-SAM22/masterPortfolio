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
  IconPreview,
  Message,
  Divider,
} from "./adminStyles";

const APIs = {
  home: "/api/home",
  socialLinks: "/api/social-links",
  skills: "/api/skills",
};

export default function AdminHome({ adminToken }) {
  const [home, setHome] = useState({
    title: "",
    logo_name: "",
    nickname: "",
    subTitle: "",
    resumeLink: "",
    portfolio_repository: "",
    githubProfile: "",
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [skills, setSkills] = useState("");
  const [editingLink, setEditingLink] = useState(null);
  const [linkForm, setLinkForm] = useState({
    name: "",
    link: "",
    fontAwesomeIcon: "",
    backgroundColor: "#333",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(APIs.home)
      .then((r) => r.json())
      .then(
        (d) =>
          d &&
          setHome({
            title: d.title || "",
            logo_name: d.logo_name || "",
            nickname: d.nickname || "",
            subTitle: d.subTitle || "",
            resumeLink: d.resumeLink || "",
            portfolio_repository: d.portfolio_repository || "",
            githubProfile: d.githubProfile || "",
          })
      );
    fetch(APIs.socialLinks)
      .then((r) => r.json())
      .then(setSocialLinks);
    fetch(APIs.skills)
      .then((r) => r.json())
      .then((d) =>
        setSkills(
          d
            ? typeof d === "object" && d.data
              ? JSON.stringify(d, null, 2)
              : JSON.stringify(d, null, 2)
            : ""
        )
      );
  }, []);

  const saveHome = (e) => {
    e.preventDefault();
    fetch(APIs.home, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(home),
    }).then(() => setMsg("Home section saved!"));
  };

  const saveSkills = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(skills);
      fetch(APIs.skills, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(parsed),
      }).then(() => setMsg("Skills saved!"));
    } catch (err) {
      setMsg("Invalid JSON for skills");
    }
  };

  const saveLink = (e) => {
    e.preventDefault();
    const url = editingLink
      ? `${APIs.socialLinks}/${editingLink.id}`
      : APIs.socialLinks;
    const method = editingLink ? "PUT" : "POST";
    const body = editingLink
      ? JSON.stringify({ ...linkForm, id: editingLink.id })
      : JSON.stringify(linkForm);
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body,
    }).then(() => {
      setEditingLink(null);
      setLinkForm({
        name: "",
        link: "",
        fontAwesomeIcon: "",
        backgroundColor: "#333",
      });
      fetch(APIs.socialLinks)
        .then((r) => r.json())
        .then(setSocialLinks);
      setMsg("Social link saved!");
    });
  };

  const deleteLink = (id) => {
    if (!window.confirm("Delete this link?")) return;
    fetch(`${APIs.socialLinks}/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).then(() =>
      fetch(APIs.socialLinks)
        .then((r) => r.json())
        .then(setSocialLinks)
    );
  };

  return (
    <Section>
      {msg && <Message>{msg}</Message>}

      <SectionTitle>Home Section</SectionTitle>
      <FormCard as="form" onSubmit={saveHome}>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={home.title}
              onChange={(e) =>
                setHome((h) => ({ ...h, title: e.target.value }))
              }
              placeholder="Your name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Nickname</Label>
            <Input
              value={home.nickname}
              onChange={(e) =>
                setHome((h) => ({ ...h, nickname: e.target.value }))
              }
              placeholder="Display nickname"
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Subtitle / Bio</Label>
          <TextArea
            value={home.subTitle}
            onChange={(e) =>
              setHome((h) => ({ ...h, subTitle: e.target.value }))
            }
            placeholder="Short description about yourself"
            required
          />
        </FormGroup>
        <FormGrid>
          <FormGroup>
            <Label>Resume URL</Label>
            <Input
              value={home.resumeLink}
              onChange={(e) =>
                setHome((h) => ({ ...h, resumeLink: e.target.value }))
              }
              placeholder="https://..."
            />
          </FormGroup>
          <FormGroup>
            <Label>GitHub Profile</Label>
            <Input
              value={home.githubProfile}
              onChange={(e) =>
                setHome((h) => ({ ...h, githubProfile: e.target.value }))
              }
              placeholder="https://github.com/..."
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Portfolio Repository</Label>
          <Input
            value={home.portfolio_repository}
            onChange={(e) =>
              setHome((h) => ({
                ...h,
                portfolio_repository: e.target.value,
              }))
            }
            placeholder="https://github.com/.../repo"
          />
        </FormGroup>
        <BtnGroup>
          <BtnPrimary type="submit">Save Home</BtnPrimary>
        </BtnGroup>
      </FormCard>

      <SectionTitle>Social Links</SectionTitle>
      <FormCard as="form" onSubmit={saveLink}>
        <FormGrid>
          <FormGroup>
            <Label>Name</Label>
            <Input
              value={linkForm.name}
              onChange={(e) =>
                setLinkForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="e.g. Github"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>URL</Label>
            <Input
              value={linkForm.link}
              onChange={(e) =>
                setLinkForm((f) => ({ ...f, link: e.target.value }))
              }
              placeholder="https://..."
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>FontAwesome Icon</Label>
            <Input
              value={linkForm.fontAwesomeIcon}
              onChange={(e) =>
                setLinkForm((f) => ({
                  ...f,
                  fontAwesomeIcon: e.target.value,
                }))
              }
              placeholder="e.g. fa-github"
            />
          </FormGroup>
          <FormGroup>
            <Label>Background Color</Label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={linkForm.backgroundColor}
                onChange={(e) =>
                  setLinkForm((f) => ({
                    ...f,
                    backgroundColor: e.target.value,
                  }))
                }
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              />
              <Input
                value={linkForm.backgroundColor}
                onChange={(e) =>
                  setLinkForm((f) => ({
                    ...f,
                    backgroundColor: e.target.value,
                  }))
                }
                placeholder="#333"
              />
            </div>
          </FormGroup>
        </FormGrid>
        <BtnGroup>
          <BtnPrimary type="submit">
            {editingLink ? "Update" : "Add"} Link
          </BtnPrimary>
          {editingLink && (
            <BtnGhost
              type="button"
              onClick={() => {
                setEditingLink(null);
                setLinkForm({
                  name: "",
                  link: "",
                  fontAwesomeIcon: "",
                  backgroundColor: "#333",
                });
              }}
            >
              Cancel
            </BtnGhost>
          )}
        </BtnGroup>
      </FormCard>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {socialLinks.map((s) => (
          <ItemCard key={s.id}>
            <ItemCardBody>
              <ItemCardHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <IconPreview
                    style={{ background: s.backgroundColor || "#333" }}
                  >
                    {s.fontAwesomeIcon ? (
                      <i
                        className={`fab ${s.fontAwesomeIcon}`}
                        style={{ fontSize: "1.1rem" }}
                      />
                    ) : (
                      s.name?.charAt(0)
                    )}
                  </IconPreview>
                  <div>
                    <ItemCardTitle>{s.name}</ItemCardTitle>
                    <ItemCardMeta>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6" }}
                      >
                        {s.link}
                      </a>
                    </ItemCardMeta>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <BtnGhost
                    onClick={() => {
                      setEditingLink(s);
                      setLinkForm({
                        name: s.name,
                        link: s.link,
                        fontAwesomeIcon: s.fontAwesomeIcon || "",
                        backgroundColor: s.backgroundColor || "#333",
                      });
                    }}
                  >
                    Edit
                  </BtnGhost>
                  <BtnDanger onClick={() => deleteLink(s.id)}>Delete</BtnDanger>
                </div>
              </ItemCardHeader>
            </ItemCardBody>
          </ItemCard>
        ))}
      </div>

      <Divider />

      <SectionTitle>Skills (JSON)</SectionTitle>
      <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 12px 0" }}>
        Edit the skills object. Must be valid JSON with a "data" array of skill
        categories.
      </p>
      <FormCard as="form" onSubmit={saveSkills}>
        <TextArea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder='{"data": [...]}'
          style={{
            minHeight: 300,
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
        />
        <BtnGroup>
          <BtnPrimary type="submit">Save Skills</BtnPrimary>
        </BtnGroup>
      </FormCard>
    </Section>
  );
}
