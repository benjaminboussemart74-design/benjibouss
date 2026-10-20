"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/sondages.module.css";
import {
  CANDIDATS,
  MOYENNE,
  PREMIER_TOUR,
  SECOND_TOUR,
  SOURCES,
  Score,
} from "./sondagesData";

// ── Formatage à la française : virgule décimale, espace insécable avant % ──
const NBSP = " ";
const nombre = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const pct = (n: number) => `${nombre(n)}${NBSP}%`;
const pts = (n: number) => `${n > 0 ? "+" : ""}${nombre(n)}${NBSP}pts`;
const scoreTexte = (s: Score) =>
  Array.isArray(s) ? `${nombre(s[0])}–${nombre(s[1])}${NBSP}%` : pct(s);

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const maj = () => setMobile(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);
  return mobile;
}

// Échelle commune des barres de premier tour : 40 % = pleine largeur
const ECHELLE = 40;

function BarreCandidat({ id, score, variation }: { id: string; score: Score; variation?: number }) {
  const c = CANDIDATS[id];
  const [min, max] = Array.isArray(score) ? score : [score, score];
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>
          {c.nom} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>· {c.parti}</span>
        </span>
        <span style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
          {variation !== undefined && (
            <span
              className={styles.mono}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: variation > 0 ? "var(--green-leg)" : "var(--red)",
              }}
            >
              {variation > 0 ? "▲" : "▼"} {pts(variation)}
            </span>
          )}
          <span className={styles.mono} style={{ fontSize: 12, fontWeight: 600 }}>
            {scoreTexte(score)}
          </span>
        </span>
      </div>
      <div style={{ position: "relative", height: 6, background: "var(--bg-sidebar)", marginTop: 4 }}>
        {/* Partie certaine de la fourchette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${(min / ECHELLE) * 100}%`,
            background: c.couleur,
            transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {/* Amplitude de la fourchette, en transparence */}
        {max > min && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(min / ECHELLE) * 100}%`,
              width: `${((max - min) / ECHELLE) * 100}%`,
              background: c.couleur,
              opacity: 0.35,
            }}
          />
        )}
      </div>
    </div>
  );
}

function CarteKpi({ label, valeur, detail }: { label: string; valeur: string; detail: string }) {
  return (
    <div style={{ background: "var(--bg-card)", padding: "14px 16px" }}>
      <p className={styles.sectionLabel}>{label}</p>
      <p className={styles.mono} style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "4px 0 2px" }}>
        {valeur}
      </p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{detail}</p>
    </div>
  );
}

function Alerte({ titre, children, ton }: { titre: string; children: React.ReactNode; ton: "amber" | "accent" }) {
  const couleur = ton === "amber" ? "var(--amber-com)" : "var(--accent)";
  const fond = ton === "amber" ? "var(--amber-light)" : "var(--accent-light)";
  return (
    <div style={{ padding: "10px 14px", background: fond, borderLeft: `3px solid ${couleur}`, marginBottom: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: couleur, margin: 0 }}>{titre}</p>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0" }}>{children}</p>
    </div>
  );
}

function DuelSecondTour() {
  const moyenne = SECOND_TOUR.reduce((s, d) => s + d.lepen, 0) / SECOND_TOUR.length;
  const rn = CANDIDATS.lepen;
  const hz = CANDIDATS.philippe;
  return (
    <div className={styles.card}>
      <p className={styles.sectionLabel}>Second tour · Le Pen contre Philippe</p>
      <h2 className={styles.h2}>Un duel favorable au RN dans toutes les enquêtes</h2>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
        <span>{rn.nom}</span>
        <span>{hz.nom}</span>
      </div>
      {SECOND_TOUR.map((d) => (
        <div key={d.institut} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span className={styles.mono} style={{ fontSize: 12, fontWeight: 600 }}>{pct(d.lepen)}</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "center" }}>
              {d.institut}{" "}
              <span className={styles.mono} style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {d.terrain}
              </span>
            </span>
            <span className={styles.mono} style={{ fontSize: 12, fontWeight: 600 }}>{pct(d.philippe)}</span>
          </div>
          <div style={{ position: "relative", display: "flex", height: 6, marginTop: 4 }}>
            <div style={{ width: `${d.lepen}%`, background: rn.couleur }} />
            <div style={{ width: `${d.philippe}%`, background: hz.couleur }} />
            {/* Repère de majorité absolue */}
            <div style={{ position: "absolute", left: "50%", top: -3, bottom: -3, width: 1, background: "var(--border-dark)" }} />
          </div>
          {d.note && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0" }}>{d.note}</p>
          )}
        </div>
      ))}
      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "12px 0 0" }}>
        Moyenne simple des {SECOND_TOUR.length} enquêtes :{" "}
        <span className={styles.mono} style={{ fontWeight: 600, color: "var(--text)" }}>{pct(moyenne)}</span> pour
        Marine Le Pen. Le filet vertical marque le seuil de 50{NBSP}%.
      </p>
    </div>
  );
}

function PremierTour() {
  const [choix, setChoix] = useState(0);
  const sondage = PREMIER_TOUR[choix];
  return (
    <>
      <div className={styles.card}>
        <p className={styles.sectionLabel}>
          Premier tour · Moyenne au {MOYENNE.date}
        </p>
        <h2 className={styles.h2}>Marine Le Pen distance tous ses concurrents</h2>
        {MOYENNE.scores.map((s) => (
          <BarreCandidat key={s.candidat} id={s.candidat} score={s.score} variation={s.variation} />
        ))}
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0" }}>
          Agrégation de {MOYENNE.enquetes} enquêtes réalisées par {MOYENNE.instituts} instituts sur les 120 derniers
          jours. Seuls les trois premiers candidats sont repris ici.
        </p>
      </div>

      <div className={styles.card}>
        <p className={styles.sectionLabel}>Premier tour · Dernières enquêtes</p>
        <h2 className={styles.h2}>Qui accompagnera Marine Le Pen au second tour ?</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {PREMIER_TOUR.map((s, i) => (
            <button
              key={s.institut}
              className={`${styles.btnSecondary} ${i === choix ? styles.btnActive : ""}`}
              onClick={() => setChoix(i)}
            >
              {s.institut}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 14px" }}>
          <span className={styles.mono} style={{ fontSize: 11 }}>{sondage.terrain}</span>
          {sondage.echantillon && (
            <>
              {" "}· <span className={styles.mono} style={{ fontSize: 11 }}>{sondage.echantillon.toLocaleString("fr-FR")}</span>{" "}
              personnes interrogées
            </>
          )}
          {" "}· {sondage.hypothese}
        </p>
        {sondage.scores.map((s) => (
          <BarreCandidat key={s.candidat} id={s.candidat} score={s.score} variation={s.variation} />
        ))}
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0" }}>
          Source :{" "}
          <a className={styles.link} href={sondage.source.url} target="_blank" rel="noreferrer">
            {sondage.source.libelle}
          </a>
          . La partie claire d’une barre représente l’amplitude de la fourchette publiée.
        </p>
      </div>
    </>
  );
}

function Methode() {
  return (
    <>
      <p className={styles.sectionLabel}>Repères</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 1, background: "var(--border)", border: "1px solid var(--border)", margin: "8px 0 20px" }}>
        <CarteKpi label="Le Pen · 1er tour" valeur={pct(MOYENNE.scores[0].score)} detail={`Moyenne au ${MOYENNE.date}`} />
        <CarteKpi
          label="Écart avec le 2e"
          valeur={pts(MOYENNE.scores[0].score - MOYENNE.scores[1].score)}
          detail="Face à Édouard Philippe"
        />
        <CarteKpi label="Enquêtes agrégées" valeur={String(MOYENNE.enquetes)} detail={`${MOYENNE.instituts} instituts · 120 jours`} />
      </div>

      <p className={styles.sectionLabel}>Contexte</p>
      <div style={{ marginTop: 8 }}>
        <Alerte titre="Candidature suspendue à la Cour de cassation" ton="amber">
          La cour d’appel de Paris a réduit l’inéligibilité de Marine Le Pen le 7 juillet 2026. La décision de la
          Cour de cassation est attendue au plus tard début janvier 2027.
        </Alerte>
        <Alerte titre="Un électorat encore mobile" ton="accent">
          Selon Elabe, 46{NBSP}% des personnes exprimant une intention de vote déclarent pouvoir changer d’avis.
        </Alerte>
      </div>

      <p className={styles.sectionLabel} style={{ marginTop: 20 }}>Méthode</p>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "6px 0 0" }}>
        Un sondage mesure un rapport de force à une date donnée ; ce n’est pas une prévision. Les marges d’incertitude
        annoncées vont de 1,2 à 2,8{NBSP}points selon le niveau du score mesuré. Les écarts entre instituts tiennent
        surtout aux hypothèses de candidatures testées.
      </p>

      <p className={styles.sectionLabel} style={{ marginTop: 20 }}>Sources</p>
      <ul style={{ fontSize: 12, paddingLeft: 16, margin: "6px 0 0" }}>
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a className={styles.link} href={s.url} target="_blank" rel="noreferrer">
              {s.libelle}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SondagesPresidentielle() {
  const mobile = useIsMobile();
  const [onglet, setOnglet] = useState<"sondages" | "methode">("sondages");

  const principal = (
    <>
      <p className={styles.sectionLabel}>Élection présidentielle · Avril 2027</p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 900,
          fontSize: mobile ? "1.7rem" : "2.3rem",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          margin: "6px 0 10px",
        }}
      >
        Le Pen en tête, la deuxième place plus disputée que jamais
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: 680, margin: "0 0 24px" }}>
        À six mois du scrutin, la candidate du Rassemblement national domine toutes les enquêtes de premier tour.
        Derrière elle, Édouard Philippe, Jean-Luc Mélenchon et Raphaël Glucksmann se tiennent dans un mouchoir de poche.
      </p>
      <PremierTour />
      <DuelSecondTour />
    </>
  );

  const barreSource = (
    <div style={{ background: "var(--bg-sidebar)", borderTop: "1px solid var(--border)", padding: "10px 24px", flexShrink: 0 }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
        Source : Elabe, YouGov, OpinionWay, Harris Interactive, Odoxa via France-Vote et Wikipédia — Données à titre
        indicatif, à vérifier auprès des notices des instituts
      </p>
    </div>
  );

  return (
    <div className={styles.root}>
      {/* Polices du système éditorial */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&family=Playfair+Display:wght@700;900&display=swap"
        precedence="default"
      />

      <header
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: mobile ? "0 12px" : "0 28px",
          height: mobile ? 48 : 52,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
            Présidentielle <span style={{ color: "var(--red)" }}>2027</span>
          </span>
          {!mobile && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Suivi des intentions de vote
            </span>
          )}
        </div>
        <span className={styles.mono} style={{ fontSize: 11, color: "var(--text-muted)" }}>
          Mis à jour le 20 oct. 2026
        </span>
      </header>
      {/* Filet rouge, signature visuelle */}
      <div style={{ height: 3, background: "var(--red)", width: "100%", flexShrink: 0 }} />

      {mobile ? (
        <>
          <main style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {onglet === "sondages" ? principal : <Methode />}
          </main>
          {barreSource}
          <nav style={{ display: "flex", height: 52, flexShrink: 0, background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
            {(["sondages", "methode"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOnglet(o)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderTop: onglet === o ? "2px solid var(--accent)" : "2px solid transparent",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: onglet === o ? 600 : 400,
                  color: onglet === o ? "var(--accent)" : "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                {o === "sondages" ? "Sondages" : "Repères et méthode"}
              </button>
            ))}
          </nav>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <aside
            style={{
              width: 300,
              flexShrink: 0,
              background: "var(--bg-sidebar)",
              borderRight: "1px solid var(--border)",
              overflowY: "auto",
              padding: 20,
            }}
          >
            <Methode />
          </aside>
          <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>{principal}</main>
        </div>
      )}
      {!mobile && barreSource}

    </div>
  );
}
