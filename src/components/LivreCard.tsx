// frontend/src/components/LivreCard.tsx
import type { Livre } from "@hendec/types/minilib";

interface LivreCardProps {
  livre: Livre;
  canReserve?:boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onReserver?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

function LivreCard(
    { 
      livre,
      canReserve, 
      canEdit,
      canDelete,
      onDelete, 
      onReserver,
      onEdit,
    }: LivreCardProps
  ) 
  {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "16px",
      backgroundColor: "#fff",
      marginBottom: "12px",
    }}>
      <h3 style={{ marginBottom: "4px" }}>{livre.titre}</h3>
      <p style={{ color: "#555", fontSize: "14px" }}>
        {livre.auteur}
        {livre.annee ? ` — ${livre.annee}` : ""}
      </p>
      {livre.genre && (
        <p style={{ fontSize: "13px", color: "#888" }}>{livre.genre}</p>
      )}
      { 
        !livre.disponible ?
          <span style={{
            display: "inline-block",
            marginTop: "8px",
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "bold",
            backgroundColor: livre.disponible ? "#E8F5E9" : "#FFEBEE",
            color: livre.disponible ? "#1B5E20" : "#B71C1C",
          }}>
            Emprunté
          </span>
        : 
          canReserve && livre.disponible && 
          (
            <button 
              type="submit" 
              id={ livre.disponible ? "buttonActive" : "buttonInactive"}
              onClick={onReserver}
            >
              Emprunter
            </button>
          )
      }
      {
        canEdit && 
        (
            <button 
              type="submit" 
              id={ livre.disponible ? "buttonActive" : "buttonInactive"}
              onClick={onEdit}
            >
              Editer
            </button>
        )
      }
      {
        canDelete && 
        (
            <button 
              type="submit" 
              id={ livre.disponible ? "buttonActive" : "buttonInactive"}
              onClick={onDelete}
            >
              Suppprimer
            </button>
        )
      }
    </div>
  );
}

export default LivreCard;
