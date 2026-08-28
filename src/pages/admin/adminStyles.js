import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeInAnim = fadeIn;

export const Section = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
`;

export const FormCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

export const FormRow = styled.div`
  margin-bottom: 12px;
`;

export const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #fff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #fff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #f8fafc;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const Btn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const BtnPrimary = styled(Btn)`
  background: #3b82f6;
  color: #fff;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
`;

export const BtnSuccess = styled(Btn)`
  background: #10b981;
  color: #fff;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

export const BtnDanger = styled(Btn)`
  background: #fee2e2;
  color: #ef4444;

  &:hover {
    background: #fecaca;
  }
`;

export const BtnGhost = styled(Btn)`
  background: #f1f5f9;
  color: #475569;

  &:hover {
    background: #e2e8f0;
  }
`;

export const BtnSmall = styled.button`
  padding: 2px 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.65rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  transition: all 0.15s;

  &:hover {
    background: #e2e8f0;
  }
`;

export const BtnDark = styled(Btn)`
  background: #1e293b;
  color: #fff;

  &:hover {
    background: #0f172a;
    transform: translateY(-1px);
  }
`;

export const BtnGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

export const ItemCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  animation: ${fadeIn} 0.3s ease-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`;

export const ItemCardBody = styled.div`
  padding: 16px;
`;

export const ItemCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const ItemCardTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

export const ItemCardMeta = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 8px;
`;

export const ItemCardDesc = styled.p`
  font-size: 0.85rem;
  color: #475569;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f1f5f9;
`;

export const SmallImagePreview = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
`;

export const IconPreview = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
`;

export const UploadArea = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #94a3b8;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => props.bg || "#f1f5f9"};
  color: ${(props) => props.color || "#475569"};
`;

export const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease-out;
  background: ${(props) => (props.error ? "#fef2f2" : "#f0fdf4")};
  color: ${(props) => (props.error ? "#dc2626" : "#16a34a")};
  border: 1px solid ${(props) => (props.error ? "#fecaca" : "#bbf7d0")};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 24px 0;
`;

export const LogoPreview = ({ src, alt, size = 48 }) => {
  if (!src) return null;
  const imgSrc = src.startsWith("/") ? src : `/uploads/${src}`;
  return (
    <img
      src={imgSrc}
      alt={alt || ""}
      onError={(e) => {
        e.target.style.display = "none";
      }}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: 8,
        background: "#f1f5f9",
        border: "2px solid #e2e8f0",
      }}
    />
  );
};

export const ImageUpload = ({ name, onChange, preview, label }) => {
  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <input
        name={name}
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
        id={`upload-${name}`}
      />
      <label htmlFor={`upload-${name}`} style={{ cursor: "pointer" }}>
        <UploadArea>
          {preview ? (
            <img
              src={preview}
              alt="preview"
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
              <div style={{ fontSize: "0.8rem" }}>Click to upload image</div>
            </div>
          )}
        </UploadArea>
      </label>
    </FormGroup>
  );
};
