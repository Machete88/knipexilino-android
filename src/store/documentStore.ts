import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DocumentItem } from '../types/document';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';

type State = {
  documents: DocumentItem[];
  loaded: boolean;
  addDocument: (doc: DocumentItem) => Promise<void>;
  updateDocument: (id: string, patch: Partial<DocumentItem>) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  replaceDocuments: (docs: DocumentItem[]) => void;
  loadDocuments: () => Promise<void>;
};

export const useDocumentStore = create<State>()(
  persist(
    (set, get) => ({
      documents: [],
      loaded: false,

      loadDocuments: async () => {
        set({ loaded: true });
      },

      addDocument: async (doc) =>
        set((state) => ({
          documents: [doc, ...state.documents],
        })),

      updateDocument: async (id, patch) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, ...patch } : d
          ),
        })),

      removeDocument: async (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),

      replaceDocuments: (docs) => set({ documents: docs }),
    }),
    {
      name: 'knipexilino-documents',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useDocumentStore.setState({ loaded: true });
      },
    }
  )
);
