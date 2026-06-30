import { useState } from 'react';

export type Note = { id: string; title: string; content: string; category: string };

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  function addNote(note: Omit<Note, 'id'>) {
    const id = Date.now().toString();
    setNotes(prev => [...prev, { id, ...note }]);
  }

  // loadNotes, updateNote, deleteNote, filterByCategory...

  return { notes, loading, addNote };
}