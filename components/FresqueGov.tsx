"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Rank = 'PM' | 'minister' | 'delegate' | 'collab';
interface Person {
  id: string;
  rank: Rank;
  reportsTo?: string;
  name: string;
  role?: string;
  dept?: string;
  tag?: string;
  color?: string;
  photo?: string;
  arc?: number;
  link?: string;
  description?: string;
}

const PM_ID = "pm";
const STORAGE_KEY = "fresque-gov";
const DEFAULT: Person[] = [
    {
      id: PM_ID,
      rank: 'PM',
      name: "Élisabeth Borne",
      role: "Première ministre",
      dept: "Hôtel de Matignon",
      color: "#0e2233",
      arc: 80,
      tag: "Renaissance",
      photo: "",
      description: "Première ministre depuis 2022. Ancienne ministre du Travail, de la Transition écologique, etc.",
    },
    {
      id: "m-edu",
      rank: 'minister',
      name: "Gabriel Attal",
      role: "Ministre d'État",
      dept: "Éducation nationale, ES & Recherche",
      color: "#ffc107",
      arc: 64,
      tag: "Renaissance",
    },
    {
      id: "m-int",
      rank: 'minister',
      name: "Bruno Retailleau",
      role: "Ministre d'État",
      dept: "Intérieur",
      color: "#2b5aa6",
      arc: 70,
      tag: "Les Républicains",
    },
    {
      id: "m-jus",
      rank: 'minister',
      name: "Gérald Darmanin",
      role: "Ministre d'État",
      dept: "Justice",
      color: "#21a0b8",
  },
  {
    id: "m-tra",
    rank: 'minister',
    name: "Catherine Vautrin",
    role: "Ministre",
    dept: "Travail, Santé, Solidarités & Familles",
    color: "#e91e63",
    arc: 66,
    tag: "Divers gauche",
  },
  // Collaborateurs du PM (reportsTo = PM_ID)
  {
    id: "c-dircab",
    rank: 'collab',
    reportsTo: PM_ID,
    name: "Jean Dupont",
    role: "Directeur de cabinet",
    dept: "Cabinet du PM",
    color: "#0e2233",
    arc: 40,
  },
  {
    id: "c-cons1",
    rank: 'collab',
    reportsTo: PM_ID,
    name: "Camille Martin",
    role: "Conseillère affaires parlementaires",
    dept: "Cabinet du PM",
    color: "#0e2233",
    arc: 40,
  },
  {
    id: "c-cons2",
    rank: 'collab',
    reportsTo: PM_ID,
    name: "Ali Ben Youssef",
    role: "Conseiller communication",
    dept: "Cabinet du PM",
    color: "#0e2233",
    arc: 40,
  },
];

  const openEditor = (person: Person | null) => {
    if (!isStaff) return;
    setEditing(person);
    setEditorOpen(true);
    setTimeout(() => {
      const f = formRef.current;
      if (!f) return;
      // On type les champs du formulaire
      const id = f.querySelector<HTMLInputElement>('input[name="id"]');
      const name = f.querySelector<HTMLInputElement>('input[name="name"]');
      const role = f.querySelector<HTMLInputElement>('input[name="role"]');
      const dept = f.querySelector<HTMLInputElement>('input[name="dept"]');
      const rank = f.querySelector<HTMLSelectElement>('select[name="rank"]');
      const reportsTo = f.querySelector<HTMLInputElement>('input[name="reportsTo"]');
      const tag = f.querySelector<HTMLInputElement>('input[name="tag"]');
      const color = f.querySelector<HTMLInputElement>('input[name="color"]');
  const photo = f.querySelector<HTMLInputElement>('input[name="photo"]');
  const description = f.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
      const arc = f.querySelector<HTMLInputElement>('input[name="arc"]');
      const link = f.querySelector<HTMLInputElement>('input[name="link"]');
      if (person !== null) {
        if (id) id.value = person.id || "";
        if (name) name.value = person.name || "";
        if (role) role.value = person.role || "";
        if (dept) dept.value = person.dept || "";
        if (rank) rank.value = person.rank || "minister";
        if (reportsTo) reportsTo.value = person.reportsTo || "";
        if (tag) tag.value = person.tag || "";
        if (color) color.value = person.color || "#f2a900";
        if (photo) photo.value = person.photo || "";
        if (arc) arc.value = String(person.arc ?? 70);
        if (link) link.value = person.link || "";
        if (description) description.value = person.description || "";
      } else {
        if (id) id.value = "";
  // ...existing code...
        {isStaff && (
          <div className="absolute top-2 right-2 gap-2 hidden staff-only:flex">
            <button
              className="px-2 py-1 rounded-md bg-white/80 hover:bg-white text-sm"
              title="Éditer"
              onClick={(e) => {
                e.stopPropagation();
                openEditor(person);
              }}
            >
              ✎
            </button>
            <button
              className="px-2 py-1 rounded-md bg-white/80 hover:bg-white text-sm"
              title="Supprimer"
              onClick={(e) => {
                e.stopPropagation();
                deletePerson(person);
              }}
            >
              🗑️
            </button>
          </div>
        )}

        {/* Chip parti */}
        <div className="absolute top-2 left-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 bg-[#e6dcc6] font-semibold text-slate-700">
          <span
            className="block w-[18px] h-[12px] rounded-[3px]"
            style={{ background: color }}
          />
          <small className="opacity-80">{person.tag || ""}</small>
        </div>

        {/* Médaillon */}
        <div className="grid place-items-center mx-auto my-2 relative" style={{ width: size, height: size }}>
          <Ring color={color} arcPercent={arc} />
          <Avatar person={person} size={avatarSize} />
        </div>

        <div className="text-center text-[#6b7d8c] uppercase tracking-[.12em] text-xs font-semibold mt-1">
          {person.role || ""}
        </div>
        <div className="text-center uppercase tracking-[.12em] font-black text-slate-800 mt-1">
          {person.name}
        </div>
        <div className="text-center text-slate-700 uppercase tracking-[.06em] text-sm mt-2">
          {person.dept || ""}
        </div>
        {person.description && (
          <div className={`text-slate-700 text-sm mt-2 whitespace-pre-line${mini ? ' text-center' : ''}`}>
            {person.description}
          </div>
        )}
      </article>
    );
  };

  // ====== Bar / actions staff ======
  const FileInput = (): React.ReactElement => {
    const iref = useRef<HTMLInputElement | null>(null);
    return (
      <>
        <button
          className="btn ghost hidden staff-only:inline-flex px-3 py-2 rounded-md bg-slate-100"
          onClick={() => iref.current?.click()}
        >
          Importer JSON
        </button>
        <input
          ref={iref}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => importJSON(e.target.files?.[0] || null)}
        />
      </>
    );
  };

  // ====== Render ======
  // Fiche de test toujours affichée
  const testPerson = DEFAULT[0]; // Fiche de test toujours affichée

  // Gestion du clic sur une bulle : fiche ou panneau PM
  const handleCardClick = (p: Person) => {
    if (p.rank === 'PM') {
      setPmOpen(true);
    } else {
      setPersonOpen(p);
    }
  };

  return (
    <div>
      {/* Fiche de test toujours affichée */}
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 relative mx-auto mt-6">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Avatar person={testPerson} size={120} />
          </div>
          <div className="font-black text-xl text-slate-800 mb-1 text-center">{testPerson.name}</div>
          <div className="text-slate-600 text-base mb-2 text-center">{testPerson.role}</div>
          <div className="text-slate-700 text-sm mb-2 text-center">{testPerson.dept}</div>
          {testPerson.tag && (
            <div className="inline-block px-3 py-1 rounded-full bg-[#e6dcc6] font-semibold text-slate-700 mb-2">{testPerson.tag}</div>
          )}
          {testPerson.description && (
            <div className="text-slate-700 text-base mt-2 whitespace-pre-line text-center">{testPerson.description}</div>
          )}
        </div>
      </div>

      {/* Modale fiche détaillée pour toute personne */}
      {personOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 relative">
            <button
              className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-slate-100"
              onClick={() => setPersonOpen(null)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar person={personOpen!} size={120} />
              </div>
              <div className="font-black text-xl text-slate-800 mb-1 text-center">{personOpen!.name}</div>
              <div className="text-slate-600 text-base mb-2 text-center">{personOpen!.role}</div>
              <div className="text-slate-700 text-sm mb-2 text-center">{personOpen!.dept}</div>
              {personOpen!.tag && (
                <div className="inline-block px-3 py-1 rounded-full bg-[#e6dcc6] font-semibold text-slate-700 mb-2">{personOpen!.tag}</div>
              )}
              {personOpen!.description && (
                <div className="text-slate-700 text-base mt-2 whitespace-pre-line text-center">{personOpen!.description}</div>
              )}
              {personOpen!.link && (
                <a href={personOpen!.link} target="_blank" rel="noopener" className="block mt-4 text-blue-700 underline">Page liée</a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Panneau PM (plein écran) */}
      {pmOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col" role="dialog" aria-modal>
          <div className="flex items-center gap-2 px-4 py-3 border-b">
            <button
              className="px-3 py-2 rounded-md bg-slate-100"
              onClick={() => setPmOpen(false)}
            >
              ← Retour
            </button>
            <h2 className="font-extrabold tracking-wide uppercase text-sm">
              {pm?.name} — {pm?.role || "Premier ministre"}
            </h2>
            <div className="flex-1" />
            <button className="px-3 py-2 rounded-md bg-slate-100" onClick={() => window.print()}>
              Imprimer
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <section className="max-w-[1300px] mx-auto mb-6">
              <h3 className="text-sm uppercase tracking-widest text-slate-700 mb-3">
                Ministres de plein exercice
              </h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {ministers
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((m) => (
                    <div key={m.id}>
                      <Bubble person={m} mini />
                      {m.description && (
                        <div className="text-slate-700 text-sm mt-1 whitespace-pre-line text-center">{m.description}</div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
            <section className="max-w-[1300px] mx-auto">
              <h3 className="text-sm uppercase tracking-widest text-slate-700 mb-3">
                Cabinet du Premier ministre
              </h3>
              <div className="grid gap-2">
                {pmStaff.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-[0_10px_30px_rgba(15,20,30,.12)]">
                    <div
                      className="w-12 h-12 rounded-full bg-center bg-cover flex items-center justify-center font-extrabold text-slate-700"
                      style={{ backgroundImage: s.photo ? `url(${s.photo})` : undefined }}
                    >
                      {!s.photo && <span>{initials(s.name)}</span>}
                    </div>
                    <div className="leading-tight flex-1">
                      <div className="font-extrabold">{s.name}</div>
                      <div className="text-slate-600 text-sm">{s.role || "Collaborateur"}</div>
                      {s.description && (
                        <div className="text-slate-700 text-sm mt-1 whitespace-pre-line">{s.description}</div>
                      )}
                    </div>
                  </div>
                ))}
                {pmStaff.length === 0 && (
                  <div className="text-slate-600">Aucun collaborateur rattaché.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Barre supérieure */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#e7e1d4]">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center gap-2">
          <h1 className="text-sm font-extrabold tracking-wide">Fresque</h1>
          <div className="flex-1" />
          {isStaff && (
            <>
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-slate-100"
                aria-pressed={editMode}
                onClick={() => setEditMode((v) => !v)}
              >
                Mode édition : {editMode ? "on" : "off"}
              </button>
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-slate-900 text-white"
                disabled={!editMode}
                onClick={() => openEditor(null)}
              >
                Ajouter
              </button>
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-slate-100"
                onClick={exportJSON}
              >
                Exporter JSON
              </button>
              <FileInput />
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-red-100 text-red-700"
                onClick={() => {
                  sessionStorage.removeItem("staff");
                  setIsStaff(false);
                  setEditMode(false);
                }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grille principale (sans collaborateurs) */}
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {mainFresque.map((p) => (
            <Bubble key={p.id} person={p} />
          ))}
        </div>
      </div>

      {/* Overlay Éditeur */}
      {editorOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-extrabold">
                {editing ? "Éditer la personne" : "Ajouter une personne"}
              </h2>
              <div className="flex-1" />
              <button
                className="px-3 py-1.5 rounded-md bg-slate-100"
                onClick={() => setEditorOpen(false)}
              >
                ✕
              </button>
            </div>
            <form ref={formRef} onSubmit={submitEditor} className="grid gap-3">
              <input name="id" type="hidden" />
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-sm">Nom complet</label>
                  <input name="name" required placeholder="Nom Prénom" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Rôle</label>
                  <input name="role" placeholder="Ministre, Directeur de cabinet…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Portefeuille / Ministère</label>
                  <input name="dept" placeholder="Intérieur, Éducation…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Rang</label>
                  <select name="rank" defaultValue="minister" className="mt-1 w-full border rounded-lg px-3 py-2">
                    <option value="PM">Premier ministre</option>
                    <option value="minister">Ministre (plein exercice)</option>
                    <option value="delegate">Ministre délégué / Secrétaire d’État</option>
                    <option value="collab">Collaborateur du PM</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Rattachement (ID du supérieur)</label>
                  <input name="reportsTo" placeholder="ID du PM si collaborateur" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Parti / étiquette</label>
                  <input name="tag" placeholder="MoDem, Renaissance…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Couleur (accent)</label>
                  <input name="color" type="color" defaultValue="#f2a900" className="mt-1 w-full border rounded-lg px-3 py-2 h-10" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Photo (URL, optionnel)</label>
                  <input name="photo" placeholder="https://…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Description (paragraphe)</label>
                  <textarea name="description" placeholder="Description, parcours, notes…" rows={3} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Arc (%)</label>
                  <input name="arc" type="number" min={0} max={100} defaultValue={70} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Page (URL, optionnel)</label>
                  <input name="link" placeholder="https://…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <p className="text-sm text-slate-600">• Si la photo est vide, des initiales seront affichées. • Les collaborateurs doivent avoir <em>rank=collab</em> et <em>reportsTo</em> = ID du PM.</p>
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" className="px-3 py-2 rounded-md bg-slate-100" onClick={() => setEditorOpen(false)}>
                  Annuler
                </button>
                <button className="px-3 py-2 rounded-md bg-slate-900 text-white">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
      {/* Barre supérieure */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#e7e1d4]">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center gap-2">
          <h1 className="text-sm font-extrabold tracking-wide">Fresque</h1>
          <div className="flex-1" />

          {/* Suppression du bouton connexion équipe */}
          {/* Les boutons staff sont masqués si non staff, donc on peut simplement afficher ceux-ci si isStaff */}
          {isStaff && (
            <>
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-slate-100"
                aria-pressed={editMode}
                onClick={() => setEditMode((v) => !v)}
              >
                Mode édition : {editMode ? "on" : "off"}
              </button>
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-slate-900 text-white"
                disabled={!editMode}
                onClick={() => openEditor(null)}
              >
                Ajouter
              </button>
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-slate-100"
                onClick={exportJSON}
              >
                Exporter JSON
              </button>
              <FileInput />
              <button
                className="staff-only:inline-flex px-3 py-2 rounded-md bg-red-100 text-red-700"
                onClick={() => {
                  sessionStorage.removeItem("staff");
                  setIsStaff(false);
                  setEditMode(false);
                }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grille principale (sans collaborateurs) */}
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {mainFresque.map((p) => (
            <Bubble key={p.id} person={p} />
          ))}
        </div>
      </div>

      {/* Overlay Éditeur */}
      {editorOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-extrabold">
                {editing ? "Éditer la personne" : "Ajouter une personne"}
              </h2>
              <div className="flex-1" />
              <button
                className="px-3 py-1.5 rounded-md bg-slate-100"
                onClick={() => setEditorOpen(false)}
              >
                ✕
              </button>
            </div>
            <form ref={formRef} onSubmit={submitEditor} className="grid gap-3">
              <input name="id" type="hidden" />
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-sm">Nom complet</label>
                  <input name="name" required placeholder="Nom Prénom" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Rôle</label>
                  <input name="role" placeholder="Ministre, Directeur de cabinet…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Portefeuille / Ministère</label>
                  <input name="dept" placeholder="Intérieur, Éducation…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Rang</label>
                  <select name="rank" defaultValue="minister" className="mt-1 w-full border rounded-lg px-3 py-2">
                    <option value="PM">Premier ministre</option>
                    <option value="minister">Ministre (plein exercice)</option>
                    <option value="delegate">Ministre délégué / Secrétaire d’État</option>
                    <option value="collab">Collaborateur du PM</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Rattachement (ID du supérieur)</label>
                  <input name="reportsTo" placeholder="ID du PM si collaborateur" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Parti / étiquette</label>
                  <input name="tag" placeholder="MoDem, Renaissance…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Couleur (accent)</label>
                  <input name="color" type="color" defaultValue="#f2a900" className="mt-1 w-full border rounded-lg px-3 py-2 h-10" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Photo (URL, optionnel)</label>
                  <input name="photo" placeholder="https://…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Description (paragraphe)</label>
                  <textarea name="description" placeholder="Description, parcours, notes…" rows={3} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="font-semibold text-sm">Arc (%)</label>
                  <input name="arc" type="number" min={0} max={100} defaultValue={70} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Page (URL, optionnel)</label>
                  <input name="link" placeholder="https://…" className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <p className="text-sm text-slate-600">• Si la photo est vide, des initiales seront affichées. • Les collaborateurs doivent avoir <em>rank=collab</em> et <em>reportsTo</em> = ID du PM.</p>
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" className="px-3 py-2 rounded-md bg-slate-100" onClick={() => setEditorOpen(false)}>
                  Annuler
                </button>
                <button className="px-3 py-2 rounded-md bg-slate-900 text-white">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale fiche détaillée pour toute personne */}
      {personOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 relative">
            <button
              className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-slate-100"
              onClick={() => setPersonOpen(null)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar person={personOpen} size={120} />
              </div>
              <div className="font-black text-xl text-slate-800 mb-1 text-center">{personOpen.name}</div>
              <div className="text-slate-600 text-base mb-2 text-center">{personOpen.role}</div>
              <div className="text-slate-700 text-sm mb-2 text-center">{personOpen.dept}</div>
              {personOpen.tag && (
                <div className="inline-block px-3 py-1 rounded-full bg-[#e6dcc6] font-semibold text-slate-700 mb-2">{personOpen.tag}</div>
              )}
              {personOpen.description && (
                <div className="text-slate-700 text-base mt-2 whitespace-pre-line text-center">{personOpen.description}</div>
              )}
              {personOpen.link && (
                <a href={personOpen.link} target="_blank" rel="noopener" className="block mt-4 text-blue-700 underline">Page liée</a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Panneau PM (plein écran) */}
      {pmOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col" role="dialog" aria-modal>
          <div className="flex items-center gap-2 px-4 py-3 border-b">
            <button
              className="px-3 py-2 rounded-md bg-slate-100"
              onClick={() => setPmOpen(false)}
            >
              ← Retour
            </button>
            <h2 className="font-extrabold tracking-wide uppercase text-sm">
              {pm?.name} — {pm?.role || "Premier ministre"}
            </h2>
            <div className="flex-1" />
            <button className="px-3 py-2 rounded-md bg-slate-100" onClick={() => window.print()}>
              Imprimer
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <section className="max-w-[1300px] mx-auto mb-6">
              <h3 className="text-sm uppercase tracking-widest text-slate-700 mb-3">
                Ministres de plein exercice
              </h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {ministers
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((m) => (
                    <div key={m.id}>
                      <Bubble person={m} mini />
                      {m.description && (
                        <div className="text-slate-700 text-sm mt-1 whitespace-pre-line text-center">{m.description}</div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
            <section className="max-w-[1300px] mx-auto">
              <h3 className="text-sm uppercase tracking-widest text-slate-700 mb-3">
                Cabinet du Premier ministre
              </h3>
              <div className="grid gap-2">
                {pmStaff.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-[0_10px_30px_rgba(15,20,30,.12)]">
                    <div
                      className="w-12 h-12 rounded-full bg-center bg-cover flex items-center justify-center font-extrabold text-slate-700"
                      style={{ backgroundImage: s.photo ? `url(${s.photo})` : undefined }}
                    >
                      {!s.photo && <span>{initials(s.name)}</span>}
                    </div>
                    <div className="leading-tight flex-1">
                      <div className="font-extrabold">{s.name}</div>
                      <div className="text-slate-600 text-sm">{s.role || "Collaborateur"}</div>
                      {s.description && (
                        <div className="text-slate-700 text-sm mt-1 whitespace-pre-line">{s.description}</div>
                      )}
                    </div>
                  </div>
                ))}
                {pmStaff.length === 0 && (
                  <div className="text-slate-600">Aucun collaborateur rattaché.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
