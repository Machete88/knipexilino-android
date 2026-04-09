import { View, Text, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { DocumentItem } from '../../src/types/document';

const MOCK_DOCS: DocumentItem[] = [
  {
    id: '1',
    title: 'Mietvertrag 2024',
    sourceType: 'pdf',
    language: 'de',
    extractedText: 'Hiermit wird ein Mietvertrag geschlossen...',
    summary: 'Mietvertrag für Wohnung, gültig ab 01.01.2024.',
    deadline: '31.12.2024',
    tags: ['Wohnung', 'Vertrag'],
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Steuerbescheid 2023',
    sourceType: 'scan',
    language: 'de',
    extractedText: 'Einkommensteuerbescheid für das Jahr 2023...',
    summary: 'Steuerbescheid mit Nachzahlung von 450 EUR.',
    deadline: '15.02.2024',
    tags: ['Steuer', 'Finanzamt'],
    createdAt: '2024-02-01T09:30:00Z',
  },
  {
    id: '3',
    title: 'Arztbrief Dr. Müller',
    sourceType: 'image',
    language: 'de',
    isPrivate: true,
    extractedText: 'Sehr geehrte Kollegen...',
    summary: 'Überweisung zum Facharzt.',
    deadline: null,
    tags: ['Gesundheit', 'Privat'],
    createdAt: '2024-03-10T14:00:00Z',
  },
];

export default function DocumentsScreen() {
  const { documents } = useDocumentStore();
  const allDocs = [...MOCK_DOCS, ...documents];

  const renderItem = ({ item }: { item: DocumentItem }) => (
    <Link href={`/document/${item.id}`} asChild>
      <Pressable style={{ backgroundColor: '#131920', borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16, flex: 1 }}>{item.title}</Text>
          {item.isPrivate && <Text style={{ color: '#ef4444', fontSize: 12 }}>🔒 Privat</Text>}
        </View>
        {item.summary && (
          <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }} numberOfLines={2}>{item.summary}</Text>
        )}
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
          <Text style={{ backgroundColor: '#1f2937', color: '#6b7280', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            {item.sourceType.toUpperCase()}
          </Text>
          {item.deadline && (
            <Text style={{ backgroundColor: '#7c3aed22', color: '#a78bfa', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
              📅 {item.deadline}
            </Text>
          )}
          {item.tags?.map((tag) => (
            <Text key={tag} style={{ backgroundColor: '#1e3a5f', color: '#60a5fa', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
              {tag}
            </Text>
          ))}
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14', padding: 16 }}>
      <FlatList
        data={allDocs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 40 }}>Keine Dokumente vorhanden.</Text>
        }
      />
    </View>
  );
}
