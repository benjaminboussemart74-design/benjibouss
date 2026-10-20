// Données d'intentions de vote · présidentielle 2027
// Relevé effectué le 20 octobre 2026 à partir de recherches web.
// Les chiffres sont à vérifier auprès des notices des instituts avant toute diffusion.

export type Candidat = {
  id: string;
  nom: string;
  parti: string;
  couleur: string; // couleur partisane (dataviz uniquement)
};

export const CANDIDATS: Record<string, Candidat> = {
  lepen: { id: "lepen", nom: "Marine Le Pen", parti: "RN", couleur: "#0A1833" },
  philippe: { id: "philippe", nom: "Édouard Philippe", parti: "Horizons", couleur: "#5B8FBF" },
  melenchon: { id: "melenchon", nom: "Jean-Luc Mélenchon", parti: "LFI", couleur: "#E8333A" },
  glucksmann: { id: "glucksmann", nom: "Raphaël Glucksmann", parti: "PP", couleur: "#ED6F8B" },
  attal: { id: "attal", nom: "Gabriel Attal", parti: "Renaissance", couleur: "#3366CC" },
  retailleau: { id: "retailleau", nom: "Bruno Retailleau", parti: "LR", couleur: "#1B3A6B" },
};

// Score unique, ou fourchette [min, max] quand l'institut publie plusieurs hypothèses
export type Score = number | [number, number];

export type SondagePremierTour = {
  institut: string;
  terrain: string;
  echantillon?: number;
  hypothese: string;
  scores: { candidat: string; score: Score; variation?: number }[];
  source: { libelle: string; url: string };
};

// Moyenne agrégée publiée par France-Vote (24 enquêtes, 9 instituts, 120 derniers jours)
export const MOYENNE = {
  date: "8 octobre 2026",
  enquetes: 24,
  instituts: 9,
  scores: [
    { candidat: "lepen", score: 34.2 },
    { candidat: "philippe", score: 17.5, variation: -1.3 },
    { candidat: "melenchon", score: 16.2, variation: 3.3 },
  ],
  source: { libelle: "France-Vote", url: "https://www.france-vote.fr/sondages" },
};

export const PREMIER_TOUR: SondagePremierTour[] = [
  {
    institut: "YouGov",
    terrain: "Publié le 18 oct. 2026",
    hypothese: "Hypothèse 1",
    scores: [
      { candidat: "lepen", score: 36 },
      { candidat: "melenchon", score: 15 },
      { candidat: "philippe", score: 13 },
      { candidat: "glucksmann", score: 13 },
      { candidat: "retailleau", score: 7 },
    ],
    source: { libelle: "France-Vote", url: "https://www.france-vote.fr/sondages" },
  },
  {
    institut: "Elabe",
    terrain: "14 – 16 oct. 2026",
    echantillon: 1701,
    hypothese: "Fourchette selon les configurations testées",
    scores: [
      { candidat: "lepen", score: [31, 33.5] },
      { candidat: "philippe", score: [15.5, 16.5] },
      { candidat: "attal", score: [9.5, 10.5], variation: -1.5 },
    ],
    source: { libelle: "Elabe", url: "https://elabe.fr/presidentielle-2027-octobre/" },
  },
];

export type Duel = {
  institut: string;
  terrain: string;
  echantillon?: number;
  lepen: number;
  philippe: number;
  note?: string;
};

// Second tour · Marine Le Pen contre Édouard Philippe, du plus récent au plus ancien
export const SECOND_TOUR: Duel[] = [
  { institut: "Elabe", terrain: "14 – 16 oct. 2026", echantillon: 1701, lepen: 52.5, philippe: 47.5 },
  { institut: "YouGov", terrain: "12 – 15 oct. 2026", lepen: 52, philippe: 48 },
  {
    institut: "OpinionWay",
    terrain: "13 – 14 oct. 2026",
    lepen: 56,
    philippe: 44,
    note: "Repère 2027 indique 57 / 43 pour une publication du 15 octobre.",
  },
  { institut: "Harris Interactive", terrain: "5 – 8 oct. 2026", lepen: 56, philippe: 44 },
  { institut: "Odoxa", terrain: "24 sept. – 7 oct. 2026", echantillon: 12005, lepen: 53, philippe: 47 },
];

export const SOURCES = [
  { libelle: "France-Vote", url: "https://www.france-vote.fr/sondages" },
  { libelle: "Elabe", url: "https://elabe.fr/presidentielle-2027-octobre/" },
  {
    libelle: "Wikipédia · Liste de sondages",
    url: "https://fr.wikipedia.org/wiki/Liste_de_sondages_sur_l'%C3%A9lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2027",
  },
  { libelle: "Repère 2027", url: "https://repere2027.fr/sondages/second-tour-2027/" },
];
