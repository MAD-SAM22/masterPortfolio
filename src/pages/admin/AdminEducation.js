import React, { useState } from "react";
import AdminDegrees from "./AdminDegrees";
import AdminCompetitiveSites from "./AdminCompetitiveSites";
import AdminCertificates from "./AdminCertificates";

const SUBTABS = [
  { key: "degrees", label: "Degrees" },
  { key: "competitive", label: "Competitive Sites" },
  { key: "certificates", label: "Certificates" },
];

export default function AdminEducation({ adminToken }) {
  const [subtab, setSubtab] = useState("degrees");

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: 12,
        }}
      >
        {SUBTABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubtab(t.key)}
            style={{
              padding: "8px 16px",
              background: subtab === t.key ? "#1e293b" : "transparent",
              color: subtab === t.key ? "#fff" : "#64748b",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ animation: "fadeIn 0.3s ease-in" }}>
        {subtab === "degrees" && <AdminDegrees adminToken={adminToken} />}
        {subtab === "competitive" && (
          <AdminCompetitiveSites adminToken={adminToken} />
        )}
        {subtab === "certificates" && (
          <AdminCertificates adminToken={adminToken} />
        )}
      </div>
    </div>
  );
}
