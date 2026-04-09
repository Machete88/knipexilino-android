import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DocumentItem } from '../types/document';

const STORAGE_KEY = 'knipexilino_documents';

type State = {
  documents: DocumentItem[];
  loaded: boolean;
  loadDocuments: () => Promise<void>;
  addDocument: (doc: DocumentItem) => Promise<void>;
  updateDocument: (id: string, patch: Partial<DocumentItem>) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
};

async function persist(docs: DocumentItem[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (_) {}
}

export const useDocumentStore = create<State>((set, get) => ({
  documents: [],
  loaded: false,

  loadDocuments: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const docs: DocumentItem[] = raw ? JSON.parse(raw) : [];
      set({ documents: docs, loaded: true });
    } catch (_) {
      set({ loaded: true });
    }
  },

  addDocument: async (doc) => {
    const next = [doc, ...get().documents];
    set({ documents: next });
    await persist(next);
  },

  updateDocument: async (id, patch) => {
    const next = get().documents.map((d) =>
      d.id === id ? { ...d, ...patch } : d
    );
    set({ documents: next });
    await persist(next);
  },

  removeDocument: async (id) => {
    const next = get().documents.filter((d) => d.id !== id);
    set({ documents: next });
    await persist(next);
  },
}));
