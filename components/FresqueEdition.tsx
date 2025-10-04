
"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/bubbles.module.css";

// Type pour une personne de la fresque
interface Person {
  id: string;
  name: string;
  role: string;
  dept: string;
  tag: string;
  color: string;
  photo?: string;
  arc: number;
  link?: string;
}

const STORAGE_KEY = "fresque_people_v1";
const DEFAULT: Person[] = [
  {id: crypto.randomUUID(), name:"François Bayrou", role:"Premier ministre", dept:"—", color:"#f2a900", arc:78, tag:"MoDem"},
  {id: crypto.randomUUID(), name:"Élisabeth Borne", role:"Ministre d'État", dept:"Éducation nationale, Enseignement supérieur & Recherche", color:"#ffc107", arc:64, tag:"Renaissance"},
  {id: crypto.randomUUID(), name:"Bruno Retailleau", role:"Ministre d'État", dept:"Intérieur", color:"#2b5aa6", arc:70, tag:"Les Républicains"},
  {id: crypto.randomUUID(), name:"Gérald Darmanin", role:"Ministre d'État", dept:"Justice", color:"#21a0b8", arc:62, tag:"Horizons"},
  {id: crypto.randomUUID(), name:"Catherine Vautrin", role:"Ministre", dept:"Travail, Santé, Solidarités & Familles", color:"#e91e63", arc:66, tag:"Divers gauche"},
];

// function sha256Hex supprimée car inutilisée

function initials(fullname: string): string {
  return fullname.split(/\s+/).map((w: string) => w[0]).join('').slice(0,2).toUpperCase();
}

interface FresqueEditionProps {
  editMode?: boolean;
}

export default function FresqueEdition({ editMode = false }: FresqueEditionProps) {
  const [people, setPeople] = useState<Person[]>(DEFAULT);
  // Suppression du système staff, tout le monde peut éditer
  const [activeTagFilter, setActiveTagFilter] = useState<string>("");
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editorPerson, setEditorPerson] = useState<Person | null>(null);

  // Chargement des données
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) setPeople(data);
      }
    } catch {}
  // Suppression de la gestion staff
  }, []);

  // Sauvegarde des données
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  }, [people]);

  // Suppression de la gestion connexion équipe
  // Rien à faire ici

  // Filtres
  const tags = Array.from(new Set(people.map((p: Person) => p.tag).filter(Boolean))).sort();

  // Ajout/édition
  const openEditor = (person: Person | null = null) => {
    setEditorPerson(person);
    setShowEditor(true);
  };
  const closeEditor = () => {
    setShowEditor(false);
    setEditorPerson(null);
  };
  const handleEditorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj = Object.fromEntries(fd.entries());
    const isEdit = !!obj.id;
    const item: Person = {
      id: isEdit ? String(obj.id) : crypto.randomUUID(),
      name: typeof obj.name === "string" ? obj.name.trim() : "",
      role: typeof obj.role === "string" ? obj.role.trim() : "",
      dept: typeof obj.dept === "string" ? obj.dept.trim() : "",
      tag: typeof obj.tag === "string" ? obj.tag : "",
      color: typeof obj.color === "string" ? obj.color : "#f2a900",
      photo: typeof obj.photo === "string" ? obj.photo.trim() : "",
      arc: Math.max(0, Math.min(100, Number(obj.arc ?? 70))),
      link: typeof obj.link === "string" ? obj.link.trim() : ""
    };
    if (isEdit) {
      setPeople(people.map((p: Person) => p.id === item.id ? item : p));
    } else {
      setPeople([item, ...people]);
    }
    closeEditor();
  };

  // Suppression
  const handleDelete = (person: Person) => {
    if (window.confirm(`Supprimer ${person.name} ?`)) {
      setPeople(people.filter((p: Person) => p.id !== person.id));
    }
  };

  // Export JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fresque_people.json';
    a.click();
  };

  // Import JSON
  const importRef = useRef<HTMLInputElement>(null);
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error('format');
      setPeople(arr.map((p: any) => ({ id: p.id || crypto.randomUUID(), name: p.name || "Sans nom", role: p.role || "", dept: p.dept || "", tag: p.tag || "", color: p.color || "#f2a900", photo: p.photo || "", arc: Number(p.arc ?? 70), link: p.link || "" })));
    } catch {
      alert("Fichier JSON invalide.");
    } finally {
      e.target.value = "";
    }
  };

  // Affichage des bulles
  const filteredPeople = people.filter((p: Person) => activeTagFilter === "" || p.tag === activeTagFilter);
  // tags déjà déclaré plus haut

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <h1>Fresque</h1>
        <div className={styles.filters}>
          <button className={styles.tag + (activeTagFilter === "" ? " " + styles.active : "")} onClick={() => setActiveTagFilter("")}>Tous</button>
          {tags.map(t => (
            <button key={t} className={styles.tag + (activeTagFilter === t ? " " + styles.active : "")} onClick={() => setActiveTagFilter(activeTagFilter === t ? "" : t)}>{t}</button>
          ))}
        </div>
  {/* Les boutons d'édition ont été retirés pour une nouvelle approche du mode édition */}
      </div>
      <div className={styles.wrap}>
        <div className={styles.grid} role="list">
          {filteredPeople.map(p => (
            <article key={p.id} className={styles.bubble} style={{ '--accent': p.color, '--arc': p.arc } as React.CSSProperties}>
              {editMode && (
                <div className={styles.editbox}>
                  <button className={styles.iconbtn} title="Éditer" onClick={() => openEditor(p)}>✎</button>
                  <button className={styles.iconbtn} title="Supprimer" onClick={() => handleDelete(p)}>🗑️</button>
                </div>
              )}
              <div className={styles.name}>{p.name}</div>
              <div className={styles.dept}>{p.dept || ""}</div>
            </article>
          ))}
        </div>
      </div>
      {showEditor && (
        <dialog open className={styles.dialog}>
          <div className={styles.sheet}>
            <h2>{editorPerson ? "Éditer la personne" : "Ajouter une personne"}</h2>
            <form onSubmit={handleEditorSubmit}>
              <input type="hidden" name="id" defaultValue={editorPerson?.id || ""} />
              <div className={styles.row}>
                <div>
                  <label>Nom complet</label>
                  <input name="name" required placeholder="Nom Prénom" defaultValue={editorPerson?.name || ""} />
                </div>
                <div>
                  <label>Rôle</label>
                  <input name="role" placeholder="Ministre, Ministre délégué…" defaultValue={editorPerson?.role || ""} />
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <label>Ministère / Portefeuille</label>
                  <input name="dept" placeholder="Intérieur, Éducation…" defaultValue={editorPerson?.dept || ""} />
                </div>
                <div>
                  <label>Parti / étiquette</label>
                  <select name="tag" defaultValue={editorPerson?.tag || ""}>
                    <option value="">—</option>
                    <option>MoDem</option>
                    <option>Renaissance</option>
                    <option>Les Républicains</option>
                    <option>Horizons</option>
                    <option>UDI</option>
                    <option>Divers gauche</option>
                    <option>Sans étiquette</option>
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <label>Couleur (accent)</label>
                  <input name="color" type="color" defaultValue={editorPerson?.color || "#f2a900"} />
                </div>
                <div>
                  <label>Photo (URL, optionnel)</label>
                  <input name="photo" placeholder="https://…" defaultValue={editorPerson?.photo || ""} />
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <label>Arc (%)</label>
                  <input name="arc" type="number" min="0" max="100" defaultValue={editorPerson?.arc ?? 70} />
                </div>
                <div>
                  <label>Page de référence (URL, optionnel)</label>
                  <input name="link" placeholder="https://…" defaultValue={editorPerson?.link || ""} />
                </div>
              </div>
              <div className={styles.hl}></div>
              <p className={styles.note}>Si la photo est vide, des initiales seront affichées.</p>
              <div className={styles.actions}>
                <button type="button" className={styles.btn + " " + styles.ghost} onClick={closeEditor}>Annuler</button>
                <button className={styles.btn + " " + styles.primary}>Enregistrer</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}
