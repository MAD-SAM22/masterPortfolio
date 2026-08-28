import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import AdminHome from "./AdminHome";
import AdminEducation from "./AdminEducation";
import AdminExperience from "./AdminExperience";
import AdminProjects from "./AdminProjects";
import AdminResearch from "./AdminResearch";
import AdminContact from "./AdminContact";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8fafc;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  margin: 0;
  padding: 0;
`;

const Sidebar = styled.div`
  width: 260px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;

  h2 {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #fff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 0.75rem;
    color: #64748b;
    margin: 4px 0 0 0;
  }
`;

const NavItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.1)" : "transparent"};
  color: ${(props) => (props.active ? "#fff" : "#94a3b8")};
  border-left: 3px solid
    ${(props) => (props.active ? "#38bdf8" : "transparent")};
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 260px;
  padding: 32px;
  animation: ${fadeIn} 0.4s ease-out;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  h1 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
`;

const LoginFormContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  margin: 0;
  padding: 0;
`;

const LoginCard = styled.div`
  background: #fff;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0f172a;
  }
`;

const TABS = [
  { key: "home", label: "Home", icon: "\u{1F3E0}" },
  { key: "education", label: "Education", icon: "\u{1F393}" },
  { key: "experience", label: "Experience", icon: "\u{1F4BC}" },
  { key: "projects", label: "Projects", icon: "\u{1F680}" },
  { key: "research", label: "Research / Blogs", icon: "\u{1F4DD}" },
  { key: "contact", label: "Contact Me", icon: "\u{1F4E7}" },
];

export default function AdminDashboard() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("admin-token") || ""
  );
  const [ok, setOk] = useState(() => !!sessionStorage.getItem("admin-token"));
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("home");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      headers: { "x-admin-token": token },
    });
    if (res.status === 401) {
      setErr("Incorrect Admin Password");
      setOk(false);
      sessionStorage.removeItem("admin-token");
    } else {
      setOk(true);
      setErr("");
      sessionStorage.setItem("admin-token", token);
    }
  };

  if (!ok) {
    return (
      <LoginFormContainer>
        <LoginCard>
          <h2 style={{ marginBottom: 8, color: "#1e293b" }}>Admin Portal</h2>
          <p style={{ marginBottom: 32, color: "#64748b", fontSize: "0.9rem" }}>
            Please enter your password to continue
          </p>
          <form onSubmit={handleLogin}>
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Password"
            />
            <Button type="submit">Unlock Dashboard</Button>
            {err && (
              <div
                style={{
                  color: "#ef4444",
                  marginTop: 16,
                  fontSize: "0.875rem",
                }}
              >
                {err}
              </div>
            )}
          </form>
        </LoginCard>
      </LoginFormContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Portfolio Admin</h2>
          <p>Manage your portfolio content</p>
        </SidebarHeader>
        {TABS.map((t) => (
          <NavItem
            key={t.key}
            active={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </NavItem>
        ))}
      </Sidebar>
      <ContentArea>
        <Header>
          <h1>{TABS.find((t) => t.key === tab)?.label}</h1>
        </Header>
        <Card>
          {tab === "home" && <AdminHome adminToken={token} />}
          {tab === "education" && <AdminEducation adminToken={token} />}
          {tab === "experience" && <AdminExperience adminToken={token} />}
          {tab === "projects" && <AdminProjects adminToken={token} />}
          {tab === "research" && <AdminResearch adminToken={token} />}
          {tab === "contact" && <AdminContact adminToken={token} />}
        </Card>
      </ContentArea>
    </DashboardContainer>
  );
}
