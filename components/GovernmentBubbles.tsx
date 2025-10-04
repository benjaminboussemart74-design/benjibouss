"use client";
import React, { useState } from "react";
import styles from "../styles/bubbles.module.css";

const initialPeople = [
  { name: "François Bayrou", role: "Premier ministre", dept: "—", color: "#f2a900", arc: 78, tag: "MoDem" },
  { name: "Élisabeth Borne", role: "Ministre d'État", dept: "Éducation nationale, Enseignement supérieur & Recherche", color: "#ffc107", arc: 64, tag: "Renaissance" },
  { name: "Bruno Retailleau", role: "Ministre d'État", dept: "Intérieur", color: "#2b5aa6", arc: 70, tag: "LR" },
  { name: "Gérald Darmanin", role: "Ministre d'État", dept: "Justice", color: "#21a0b8", arc: 62, tag: "Horizons" },
  { name: "Catherine Vautrin", role: "Ministre", dept: "Travail, Santé, Solidarités & Familles", color: "#e91e63", arc: 66, tag: "DG" },
];

function initials(fullname: string) {
  return fullname.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function GovernmentBubbles() {
  const [people, setPeople] = useState(initialPeople);
  const [modal, setModal] = useState<null | typeof initialPeople[0]>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', dept: '', color: '#f2a900', arc: 70, tag: '' });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setPeople([...people, { ...form }]);
    setForm({ name: '', role: '', dept: '', color: '#f2a900', arc: 70, tag: '' });
    setEditMode(false);
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.editBtn} onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Annuler' : 'Ajouter un membre'}
      </button>
      {editMode && (
        <form className={styles.editForm} onSubmit={handleAdd}>
          <input required placeholder="Nom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input required placeholder="Rôle" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <input placeholder="Département" value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} />
          <input placeholder="Couleur" type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          <input placeholder="Arc (%)" type="number" min={0} max={100} value={form.arc} onChange={e => setForm(f => ({ ...f, arc: Number(e.target.value) }))} />
          <input placeholder="Parti/Tag" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
          <button type="submit">Ajouter</button>
        </form>
      )}
      <div className={styles.grid} role="list">
        {people.map((p, i) => (
          <article
            key={i}
            className={styles.bubble}
            tabIndex={0}
            style={{
              ['--accent' as any]: p.color,
              ['--arc' as any]: p.arc,
            }}
            onClick={() => setModal(p)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setModal(p);
              }
            }}
          >
            <div className={styles.chip}><span className={styles.sw}></span><small>{p.tag}</small></div>
            <div className={styles.medal}>
              <div className={styles.ring}></div>
              <div className={styles.dash}></div>
              <div className={styles.avatar}>{initials(p.name)}</div>
            </div>
            <div className={styles.role}>{p.role}</div>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.dept}>{p.dept}</div>
            <button className={styles.cta} type="button" onClick={() => setModal(p)}>ouvrir</button>
          </article>
        ))}
      </div>
  {modal && (
        <div className={styles.modalBackdrop} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <div className={styles.thumb}>{initials(modal.name)}</div>
              <div>
                <h3>{modal.name}</h3>
                <p>{modal.role}</p>
              </div>
            </header>
            <p className={styles.modalDept}>{modal.dept}</p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={() => setModal(null)}>Fermer</button>
              <button className={styles.btnPrimary} onClick={() => alert(`Ici tu peux router vers la page de ${modal.name}`)}>Voir la page</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
