# Dix ans de béton à Noisy-le-Grand

Page éditoriale interactive consacrée aux permis de construire délivrés à Noisy-le-Grand entre 2015 et 2026 : carte des quartiers et des quartiers prioritaires, recherche par adresse avec rayon, chronologie année par année, comparaison avant et depuis mars 2026, sources et méthode.

## Contenu du dossier

- `index.html` : la page complète (styles, données et scripts intégrés). La police Barlow vient de Google Fonts et la bibliothèque de cartes Leaflet 1.9.4 de cdnjs.
- `tiles/` : le fond de carte Plan IGN (© IGN, licence ouverte Etalab 2.0), téléchargé depuis la Géoplateforme pour la commune et ses abords, niveaux de zoom 12 à 17, assemblé en blocs de 4 × 4 tuiles (images WebP de 1 024 px, chemin `tiles/{z-2}/{x}/{y}.webp`).

## Site en ligne

https://dix-ans-de-beton-nlg.vercel.app (projet Vercel « dix-ans-de-beton-nlg », publié depuis ce dossier ; les dossiers et fichiers listés dans `.vercelignore` ne sont pas publiés).

## Version de travail (Claude)

https://claude.ai/artifact/YPdH3GHVLVatu8PHGiZy4r

## Consulter la page en local

Le fond de carte étant fait d'images à part, il faut servir le dossier plutôt qu'ouvrir le fichier directement :

```bash
cd beton-noisy
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 dans un navigateur.
