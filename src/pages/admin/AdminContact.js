import React, { useState, useEffect } from "react";

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

  const css = {
    input: {
      width: "100%",
      padding: 8,
      marginBottom: 12,
      border: "1px solid #ccc",
      borderRadius: 4,
    },
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2>Contact Me Section</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <h3>Contact Section</h3>
        <input
          style={css.input}
          value={data.contactSection.title}
          onChange={(e) =>
            handleChange("contactSection", "title", e.target.value)
          }
          placeholder="Title"
        />
        <input
          style={css.input}
          value={data.contactSection.profile_image_path}
          onChange={(e) =>
            handleChange("contactSection", "profile_image_path", e.target.value)
          }
          placeholder="Profile image filename (e.g. osama_img.jpg)"
        />
        <textarea
          style={{ ...css.input, minHeight: 80 }}
          value={data.contactSection.description}
          onChange={(e) =>
            handleChange("contactSection", "description", e.target.value)
          }
          placeholder="Description"
        />

        <h3>Address Section</h3>
        <input
          style={css.input}
          value={data.addressSection.title}
          onChange={(e) =>
            handleChange("addressSection", "title", e.target.value)
          }
          placeholder="Title"
        />
        <input
          style={css.input}
          value={data.addressSection.subtitle}
          onChange={(e) =>
            handleChange("addressSection", "subtitle", e.target.value)
          }
          placeholder="Subtitle / Full address"
        />
        <input
          style={css.input}
          value={data.addressSection.streetAddress}
          onChange={(e) =>
            handleChange("addressSection", "streetAddress", e.target.value)
          }
          placeholder="Street"
        />
        <input
          style={css.input}
          value={data.addressSection.locality}
          onChange={(e) =>
            handleChange("addressSection", "locality", e.target.value)
          }
          placeholder="City"
        />
        <input
          style={css.input}
          value={data.addressSection.region}
          onChange={(e) =>
            handleChange("addressSection", "region", e.target.value)
          }
          placeholder="State/Region"
        />
        <input
          style={css.input}
          value={data.addressSection.postalCode}
          onChange={(e) =>
            handleChange("addressSection", "postalCode", e.target.value)
          }
          placeholder="Postal code"
        />
        <input
          style={css.input}
          value={data.addressSection.country}
          onChange={(e) =>
            handleChange("addressSection", "country", e.target.value)
          }
          placeholder="Country"
        />
        <input
          style={css.input}
          value={data.addressSection.location_map_link}
          onChange={(e) =>
            handleChange("addressSection", "location_map_link", e.target.value)
          }
          placeholder="Google Maps link"
        />

        <h3>Blog Section</h3>
        <input
          style={css.input}
          value={data.blogSection.title}
          onChange={(e) => handleChange("blogSection", "title", e.target.value)}
          placeholder="Title"
        />
        <input
          style={css.input}
          value={data.blogSection.subtitle}
          onChange={(e) =>
            handleChange("blogSection", "subtitle", e.target.value)
          }
          placeholder="Subtitle"
        />
        <input
          style={css.input}
          value={data.blogSection.link}
          onChange={(e) => handleChange("blogSection", "link", e.target.value)}
          placeholder="Blog URL"
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save Contact Data
        </button>
      </form>
    </div>
  );
}
