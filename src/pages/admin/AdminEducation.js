import React, { useState } from "react";
import styled from "styled-components";
import AdminDegrees from "./AdminDegrees";
import AdminCompetitiveSites from "./AdminCompetitiveSites";
import AdminCertificates from "./AdminCertificates";

const SubTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
`;

const SubTab = styled.button`
  padding: 8px 18px;
  background: ${(props) => (props.active ? "#1e293b" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#64748b")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? "#1e293b" : "#f1f5f9")};
    color: ${(props) => (props.active ? "#fff" : "#1e293b")};
  }
`;

const SUBTABS = [
  { key: "degrees", label: "Degrees" },
  { key: "competitive", label: "Competitive Sites" },
  { key: "certificates", label: "Certificates" },
];

export default function AdminEducation({ adminToken }) {
  const [subtab, setSubtab] = useState("degrees");

  return (
    <div>
      <SubTabs>
        {SUBTABS.map((t) => (
          <SubTab
            key={t.key}
            active={subtab === t.key}
            onClick={() => setSubtab(t.key)}
          >
            {t.label}
          </SubTab>
        ))}
      </SubTabs>
      <div>
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
