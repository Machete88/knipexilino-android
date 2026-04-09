import { create } from 'zustand';
import { DocumentItem } from '../types/document';

type State = {
  documents: DocumentItem[];
  addDocument: (doc: DocumentItem) => void;
  updateDocument: (id: string, patch: Partial<DocumentItem>) => void;
  removeDocument: (id: string) => void;
};

export const useDocumentStore = create<State>((set) => ({
  documents: [],
  addDocument: (doc) =>
    set((state) => ({
      documents: [doc, ...state.documents],
    })),
  updateDocument: (id, patch) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...patch } : d
      ),
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
}));
