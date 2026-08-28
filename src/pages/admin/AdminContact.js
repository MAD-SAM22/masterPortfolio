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
  Message,
  LogoPreview,
} from "./adminStyles";

const API = "/api/contact-data";

export default function AdminContact({ adminToken }) {
  const [data, setData] = useState({
    contactSection: {
      title: "Contact Me",
      profile_image_path: "",
      description: "",
    },
    blogSection: { title: "", subtitle: "", link: "", avatar_image_path: "" },
    addressSection: {
      title: "",
      subtitle: "",
      locality: "",
      country: "",
      region: "",
      postalCode: "",
      streetAddress: "",
      location_map_link: "",
    },
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        if (d && Object.keys(d).length) {
          setData((prev) => ({
            contactSection: { ...prev.contactSection, ...d.contactSection },
            blogSection: { ...prev.blogSection, ...d.blogSection },
            addressSection: { ...prev.addressSection, ...d.addressSection },
          }));
        }
      });
  }, []);

  const handleChange = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify(data),
    }).then(() => setMsg("Contact data saved!"));
  };

  return (
    <Section>
      {msg && <Message>{msg}</Message>}

      <FormCard as="form" onSubmit={handleSubmit}>
        <SectionTitle>Contact Section</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={data.contactSection.title}
              onChange={(e) =>
                handleChange("contactSection", "title", e.target.value)
              }
              placeholder="e.g. Contact Me"
            />
          </FormGroup>
          <FormGroup>
            <Label>Profile Image</Label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Input
                value={data.contactSection.profile_image_path}
                onChange={(e) =>
                  handleChange(
                    "contactSection",
                    "profile_image_path",
                    e.target.value
                  )
                }
                placeholder="e.g. osama_img.jpg"
              />
              <LogoPreview
                src={data.contactSection.profile_image_path}
                size={40}
              />
            </div>
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Description</Label>
          <TextArea
            value={data.contactSection.description}
            onChange={(e) =>
              handleChange("contactSection", "description", e.target.value)
            }
            placeholder="Availability description"
          />
        </FormGroup>

        <SectionTitle>Address Section</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={data.addressSection.title}
              onChange={(e) =>
                handleChange("addressSection", "title", e.target.value)
              }
              placeholder="e.g. Address"
            />
          </FormGroup>
          <FormGroup>
            <Label>Street Address</Label>
            <Input
              value={data.addressSection.streetAddress}
              onChange={(e) =>
                handleChange("addressSection", "streetAddress", e.target.value)
              }
              placeholder="Street"
            />
          </FormGroup>
          <FormGroup>
            <Label>City</Label>
            <Input
              value={data.addressSection.locality}
              onChange={(e) =>
                handleChange("addressSection", "locality", e.target.value)
              }
              placeholder="City"
            />
          </FormGroup>
          <FormGroup>
            <Label>State / Region</Label>
            <Input
              value={data.addressSection.region}
              onChange={(e) =>
                handleChange("addressSection", "region", e.target.value)
              }
              placeholder="State/Region"
            />
          </FormGroup>
          <FormGroup>
            <Label>Postal Code</Label>
            <Input
              value={data.addressSection.postalCode}
              onChange={(e) =>
                handleChange("addressSection", "postalCode", e.target.value)
              }
              placeholder="Postal code"
            />
          </FormGroup>
          <FormGroup>
            <Label>Country</Label>
            <Input
              value={data.addressSection.country}
              onChange={(e) =>
                handleChange("addressSection", "country", e.target.value)
              }
              placeholder="Country"
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Full Address / Subtitle</Label>
          <Input
            value={data.addressSection.subtitle}
            onChange={(e) =>
              handleChange("addressSection", "subtitle", e.target.value)
            }
            placeholder="Full address string"
          />
        </FormGroup>
        <FormGroup>
          <Label>Google Maps Link</Label>
          <Input
            value={data.addressSection.location_map_link}
            onChange={(e) =>
              handleChange(
                "addressSection",
                "location_map_link",
                e.target.value
              )
            }
            placeholder="https://maps.google.com/..."
          />
        </FormGroup>

        <SectionTitle>Blog Section</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Title</Label>
            <Input
              value={data.blogSection.title}
              onChange={(e) =>
                handleChange("blogSection", "title", e.target.value)
              }
              placeholder="e.g. Blogs"
            />
          </FormGroup>
          <FormGroup>
            <Label>Subtitle</Label>
            <Input
              value={data.blogSection.subtitle}
              onChange={(e) =>
                handleChange("blogSection", "subtitle", e.target.value)
              }
              placeholder="Blog section description"
            />
          </FormGroup>
          <FormGroup>
            <Label>Blog URL</Label>
            <Input
              value={data.blogSection.link}
              onChange={(e) =>
                handleChange("blogSection", "link", e.target.value)
              }
              placeholder="https://..."
            />
          </FormGroup>
          <FormGroup>
            <Label>Avatar Image</Label>
            <Input
              value={data.blogSection.avatar_image_path}
              onChange={(e) =>
                handleChange("blogSection", "avatar_image_path", e.target.value)
              }
              placeholder="e.g. blogs_image.svg"
            />
          </FormGroup>
        </FormGrid>

        <div style={{ marginTop: 16 }}>
          <BtnPrimary type="submit">Save Contact Data</BtnPrimary>
        </div>
      </FormCard>
    </Section>
  );
}
