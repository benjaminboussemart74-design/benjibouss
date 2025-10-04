"use client";
import { useState, useEffect } from "react";
// Suppression des imports liés aux personnes

function FichesMinistres() {
  const [fiches, setFiches] = useState<any[]>([]);
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("");

  // Charger les fiches au montage
  useEffect(() => {
    fetch("/api/fiches")
      .then(res => res.json())
      .then(data => setFiches(data));
  }, []);

  // Ajouter une fiche
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/fiches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, role })
    });
    const fiche = await res.json();
    setFiches([...fiches, fiche]);
    setNom("");
    setRole("");
  };

  return (
    <div style={{ margin: "2rem auto", maxWidth: 400, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Ajouter une fiche ministre/collab</h2>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={nom}
          onChange={e => setNom(e.target.value)}
          placeholder="Nom"
          required
          style={{ flex: 1 }}
        />
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="Rôle"
          required
          style={{ flex: 1 }}
        />
        <button type="submit">Ajouter</button>
      </form>
      <ul style={{ paddingLeft: 0 }}>
        {fiches.map(f => (
          <li key={f.id} style={{ listStyle: "none", marginBottom: "0.5rem" }}>
            <strong>{f.nom}</strong> — {f.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEditClick = () => setShowModal(true);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mangue-01102025") {
      setEditMode(true);
      setShowModal(false);
      setPassword("");
      setError("");
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <>
      <main>
        {/* Composants liés aux personnes supprimés pour repartir sur des bases saines */}
        {editMode && <FichesMinistres />}
      </main>
      {/* Bouton discret en bas à droite */}
      {/* Modal mot de passe */}
      {showModal && (
          {/* Modal mot de passe supprimée */}
      )}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: '2rem', padding: '2rem 0', background: '#f5f5f5' }}>
        {/* Bouton édition en bas à gauche du footer */}
        {!editMode && (
          <button
            onClick={handleEditClick}
            style={{
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              background: "#e0e7ef",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              marginLeft: "32px",
              marginRight: "48px"
            }}
            aria-label="Activer le mode édition"
          >
            ✏️
          </button>
        )}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img
            src="/LogoRP&co bleu sans point.png"
            alt="Logo RP&co"
            style={{ width: '120px', marginBottom: '1rem' }}
          />
          <p style={{ maxWidth: '400px', margin: '0 auto', color: '#333' }}>
            Qui sommes-nous ? <br />
            {/* Ce paragraphe peut être généré dynamiquement */}
            Nous sommes une équipe passionnée dédiée à l'accompagnement et au conseil en relations publiques et communication.
          </p>
        </div>
      </footer>
    </>
  );
}