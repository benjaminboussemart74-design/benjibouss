"use client";
import React, { useState } from "react";

// Structure de l’arbre hiérarchique (exemple minimal)
const governmentTree = {
  name: "Premier Ministre",
  bio: "Biographie du Premier Ministre...",
  children: [
    {
      name: "Ministre d’État 1",
      bio: "Biographie du Ministre d’État 1...",
      children: [
        {
          name: "Secrétaire Général A",
          bio: "Biographie du Secrétaire Général A...",
          children: [
            { name: "Collaborateur 1", bio: "Bio Collaborateur 1...", children: [] },
            { name: "Collaborateur 2", bio: "Bio Collaborateur 2...", children: [] }
          ]
        }
      ]
    },
    {
      name: "Ministre d’État 2",
      bio: "Biographie du Ministre d’État 2...",
      children: [
        {
          name: "Secrétaire Général B",
          bio: "Biographie du Secrétaire Général B...",
          children: [
            { name: "Collaborateur 3", bio: "Bio Collaborateur 3...", children: [] }
          ]
        }
      ]
    }
  ]
};

function TreeNode({ node }: { node: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginLeft: 20, marginTop: 10 }}>
      <div style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => setOpen(!open)}>
        {node.name}
      </div>
      {open && (
        <div style={{ marginLeft: 10 }}>
          <div style={{ fontStyle: "italic", color: "#555" }}>{node.bio}</div>
          {node.children && node.children.length > 0 && (
            <div>
              {node.children.map((child: any, idx: number) => (
                <TreeNode key={idx} node={child} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GovernmentTree() {
  return (
    <div>
      <h2>Arbre hiérarchique du gouvernement</h2>
      <TreeNode node={governmentTree} />
    </div>
  );
}
