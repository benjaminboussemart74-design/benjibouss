"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import styles from "../styles/Ministers.module.css";

interface ApiMinisterRecord {
  id?: string;
  uuid?: string;
  slug?: string;
  nom?: string;
  name?: string;
  full_name?: string;
  prenom?: string;
  role?: string;
  titre?: string;
  position?: string;
  portfolio?: string;
  ministere?: string;
  departement?: string;
  department?: string;
  tag?: string;
  party?: string;
  affiliation?: string;
  couleur?: string;
  color?: string;
  photo?: string;
  photo_url?: string;
  portrait?: string;
  image_url?: string;
  biography?: string;
  bio?: string;
  description?: string;
  email?: string;
  contact_email?: string;
  phone?: string;
  telephone?: string;
  website?: string;
  lien?: string;
  link?: string;
  twitter?: string;
  x?: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface Minister {
  id: string;
  fullName: string;
  role: string;
  portfolio: string;
  party?: string | null;
  color: string;
  photoUrl?: string | null;
  biography?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  twitter?: string | null;
  updatedAt?: string | null;
}

const COLOR_SWATCHES = ["#64D7CD", "#6987FF", "#F0A08C", "#4CCF78", "#D1007B"];

const normalizeText = (value: string | null | undefined) => (value ?? "").trim();

const getStableColor = (id: string, fallback?: string | null) => {
  if (fallback) {
    return fallback;
  }

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % COLOR_SWATCHES.length;
  return COLOR_SWATCHES[index];
};

const createFallbackId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `minister-${Math.random().toString(36).slice(2, 11)}`;
};

const toMinister = (record: ApiMinisterRecord): Minister => {
  const primaryName =
    normalizeText(record.full_name as string) ||
    normalizeText(record.name as string) ||
    normalizeText(record.nom as string) ||
    normalizeText(record.prenom as string);

  const role =
    normalizeText(record.role as string) ||
    normalizeText(record.titre as string) ||
    normalizeText(record.position as string);

  const portfolio =
    normalizeText(record.portfolio as string) ||
    normalizeText(record.ministere as string) ||
    normalizeText(record.departement as string) ||
    normalizeText(record.department as string);

  const party =
    normalizeText(record.party as string) ||
    normalizeText(record.tag as string) ||
    normalizeText(record.affiliation as string);

  const idCandidate =
    normalizeText(record.id as string) ||
    normalizeText(record.uuid as string) ||
    normalizeText(record.slug as string) ||
    `${primaryName}-${role}`.toLowerCase().replace(/\s+/g, "-") ||
    createFallbackId();

  const colorCandidate = (record.color as string) ?? (record.couleur as string) ?? null;

  return {
    id: idCandidate,
    fullName: primaryName || "Ministre", // fallback name
    role,
    portfolio,
    party: party || null,
    color: getStableColor(idCandidate, colorCandidate),
    photoUrl:
      (record.photo_url as string) ||
      (record.photo as string) ||
      (record.portrait as string) ||
      (record.image_url as string) ||
      null,
    biography: (record.biography as string) || (record.bio as string) || (record.description as string) || null,
    email: (record.email as string) || (record.contact_email as string) || null,
    phone: (record.phone as string) || (record.telephone as string) || null,
    website: (record.website as string) || (record.lien as string) || (record.link as string) || null,
    twitter: (record.twitter as string) || (record.x as string) || null,
    updatedAt: (record.updated_at as string) || null,
  };
};

const buildInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MinistersShowcase() {
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Minister | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMinisters = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/ministers", { cache: "no-store" });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error ?? "Impossible de récupérer les ministres.";
        throw new Error(message);
      }

      const data = (await response.json()) as ApiMinisterRecord[];
      const normalized = data.map(toMinister);
      normalized.sort((a, b) => a.fullName.localeCompare(b.fullName, "fr"));
      setMinisters(normalized);
    } catch (fetchError) {
      console.error(fetchError);
      setError(fetchError instanceof Error ? fetchError.message : "Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMinisters();
  }, [fetchMinisters]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const parties = useMemo(() => {
    const unique = new Set<string>();
    ministers.forEach((minister) => {
      if (minister.party) {
        unique.add(minister.party);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "fr"));
  }, [ministers]);

  const filteredMinisters = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ministers.filter((minister) => {
      const matchesFilter =
        activeFilter === "all" || (minister.party && minister.party.toLowerCase() === activeFilter.toLowerCase());

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [minister.fullName, minister.role, minister.portfolio, minister.party]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [activeFilter, ministers, search]);

  const isInitialLoading = isLoading && ministers.length === 0;

  const handleCardClick = (minister: Minister) => {
    setSelected(minister);
  };

  const handleCardKeyDown = (minister: Minister, event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(minister);
    }
  };

  const heroSubtitle = ministers.length > 0 ? `${ministers.length} profils synchronisés depuis Supabase` : "Cartographie dynamique de l'équipe gouvernementale";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandEyebrow}>Rumeur Publique • Data civique</span>
          <div>
            <h1 className={styles.brandTitle}>Observatoire des Ministres</h1>
            <p className={styles.brandBaseline}>
              Une bibliothèque interactive qui se met à jour automatiquement depuis Supabase pour suivre l'actualité du gouvernement.
            </p>
          </div>
        </div>
        <div className={styles.hero}>
          <span className={styles.heroKicker}>Veille stratégique</span>
          <h2 className={styles.heroTitle}>Visualisez les profils ministériels en un coup d'œil</h2>
          <p className={styles.heroCopy}>{heroSubtitle}</p>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={fetchMinisters}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Actualisation..." : "Actualiser les données"}
            </button>
            <a className={styles.buttonGhost} href="#ministers">
              Explorer les vignettes
            </a>
          </div>
        </div>
      </header>

      <main className={styles.main} id="ministers">
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Vignettes ministérielles</h2>
            <p className={styles.sectionSubtitle}>
              Filtrez et parcourez les profils pour préparer les fiches détaillées et les dossiers de presse.
            </p>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.search}>
              <label className={styles.searchLabel} htmlFor="minister-search">
                Recherche ciblée
              </label>
              <input
                id="minister-search"
                className={styles.searchInput}
                type="search"
                placeholder="Nom, portefeuille ou appartenance..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className={styles.filters}>
              <button
                type="button"
                className={`${styles.filterButton} ${activeFilter === "all" ? styles.filterButtonActive : ""}`.trim()}
                onClick={() => setActiveFilter("all")}
              >
                Tous
              </button>
              {parties.map((party) => (
                <button
                  key={party}
                  type="button"
                  className={`${styles.filterButton} ${activeFilter === party ? styles.filterButtonActive : ""}`.trim()}
                  onClick={() => setActiveFilter(party)}
                >
                  {party}
                </button>
              ))}
            </div>
          </div>

          {error && <div className={styles.emptyState}>{error}</div>}

          {isInitialLoading ? (
            <div className={styles.loading}>Chargement des données ministérielles…</div>
          ) : (
            <>
              <div className={styles.grid}>
                {filteredMinisters.map((minister) => {
                  const initials = buildInitials(minister.fullName);
                  return (
                    <article
                      key={minister.id}
                      className={styles.card}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardClick(minister)}
                      onKeyDown={(event) => handleCardKeyDown(minister, event)}
                    >
                      {minister.party && (
                        <div className={styles.cardBadge}>
                          <span
                            className={styles.cardBadgeSwatch}
                            style={{ background: minister.color }}
                            aria-hidden="true"
                          />
                          {minister.party}
                        </div>
                      )}
                      <div className={styles.cardImageWrapper}>
                        {minister.photoUrl ? (
                          <img
                            src={minister.photoUrl}
                            alt={minister.fullName}
                            className={styles.cardImage}
                          />
                        ) : (
                          <div className={styles.cardFallback} style={{ color: minister.color }}>
                            {initials || "RP"}
                          </div>
                        )}
                      </div>
                      {minister.role && <div className={styles.cardRole}>{minister.role}</div>}
                      <h3 className={styles.cardName}>{minister.fullName}</h3>
                      {minister.portfolio && <p className={styles.cardPortfolio}>{minister.portfolio}</p>}
                    </article>
                  );
                })}
              </div>
              {filteredMinisters.length === 0 && !error && (
                <div className={styles.emptyState}>
                  Aucun résultat ne correspond à vos filtres. Modifiez votre recherche pour afficher d'autres profils.
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <div className={selected ? styles.modal : styles.modalHidden} role="dialog" aria-modal="true">
        {selected && (
          <>
            <div className={styles.modalBackdrop} onClick={() => setSelected(null)} />
            <div className={styles.modalContent}>
              <button
                type="button"
                className={styles.modalClose}
                aria-label="Fermer la fiche"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
              <div className={styles.modalBody}>
                <div className={styles.modalHeader}>
                  {selected.photoUrl ? (
                    <img src={selected.photoUrl} alt={selected.fullName} className={styles.modalPhoto} />
                  ) : (
                    <div className={styles.modalPhoto} style={{ display: "grid", placeItems: "center", color: selected.color }}>
                      {buildInitials(selected.fullName) || "RP"}
                    </div>
                  )}
                  <div>
                    {selected.role && <div className={styles.modalRole}>{selected.role}</div>}
                    <h3 className={styles.modalName}>{selected.fullName}</h3>
                    {selected.portfolio && <div className={styles.modalPortfolio}>{selected.portfolio}</div>}
                  </div>
                </div>
                {selected.biography && <div className={styles.modalDescription}>{selected.biography}</div>}
                <div className={styles.modalMeta}>
                  {selected.party && (
                    <div className={styles.modalMetaItem}>
                      <span className={styles.modalMetaLabel}>Appartenance</span>
                      <span className={styles.modalMetaValue}>{selected.party}</span>
                    </div>
                  )}
                  {(selected.email || selected.phone) && (
                    <div className={styles.modalMetaItem}>
                      <span className={styles.modalMetaLabel}>Contacts</span>
                      <span className={styles.modalMetaValue}>
                        {selected.email && <div>{selected.email}</div>}
                        {selected.phone && <div>{selected.phone}</div>}
                      </span>
                    </div>
                  )}
                  {(selected.website || selected.twitter) && (
                    <div className={styles.modalMetaItem}>
                      <span className={styles.modalMetaLabel}>Réseaux</span>
                      <span className={styles.modalMetaValue}>
                        {selected.website && (
                          <a href={selected.website} target="_blank" rel="noreferrer">
                            Site officiel
                          </a>
                        )}
                        {selected.twitter && (
                          <a href={selected.twitter.startsWith("http") ? selected.twitter : `https://twitter.com/${selected.twitter.replace(/^@/, "")}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Twitter
                          </a>
                        )}
                      </span>
                    </div>
                  )}
                  {formatDate(selected.updatedAt) && (
                    <div className={styles.modalMetaItem}>
                      <span className={styles.modalMetaLabel}>Dernière mise à jour</span>
                      <span className={styles.modalMetaValue}>{formatDate(selected.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
