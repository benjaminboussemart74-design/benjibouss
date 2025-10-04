// API Next.js pour gérer les fiches ministres/collaborateurs en mémoire

let fiches = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Retourne toutes les fiches
    res.status(200).json(fiches);
  } else if (req.method === 'POST') {
    // Ajoute une nouvelle fiche
    const fiche = req.body;
    fiche.id = Date.now().toString();
    fiches.push(fiche);
    res.status(201).json(fiche);
  } else if (req.method === 'PUT') {
    // Modifie une fiche existante
    const { id, ...data } = req.body;
    fiches = fiches.map(f => f.id === id ? { ...f, ...data } : f);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    // Supprime une fiche
    const { id } = req.body;
    fiches = fiches.filter(f => f.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
