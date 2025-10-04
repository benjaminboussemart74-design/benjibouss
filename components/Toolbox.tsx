import React, { useState } from 'react';

export default function Toolbox({ onAdd, onEdit, onDelete }: {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <aside style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: 220,
      height: '100vh',
      background: '#f5f5f5',
      borderLeft: '1px solid #ddd',
      padding: 20,
      boxShadow: '0 0 8px #ccc',
      zIndex: 1000
    }}>
      <h3>Boîte à outils</h3>
      <button style={{ marginBottom: 10, width: '100%' }} onClick={onAdd}>Ajouter un nœud</button>
      <button style={{ marginBottom: 10, width: '100%' }} onClick={onEdit}>Éditer le nœud</button>
      <button style={{ width: '100%' }} onClick={onDelete}>Supprimer le nœud</button>
    </aside>
  );
}
