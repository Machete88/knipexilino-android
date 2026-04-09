import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { runAiTask } from '../../src/services/ai';
import { detectDeadline } from '../../src/services/deadline';

const MOCK_DOCS = [
  { id: '1', title: 'Mietvertrag 2024', sourceType: 'pdf', language: 'de', extractedText: 'Hiermit wird ein Mietvertrag geschlossen. Kaltmiete 850 EUR, Frist zur Kündigung: 31.12.2024.', summary: 'Mietvertrag für Wohnung, gültig ab 01.01.2024.', deadline: '31.12.2024', tags: ['Wohnung', 'Vertrag'], createdAt: '2024-01-01T10:00:00Z' },
  { id: '2', title: 'Steuerbescheid 2023', sourceType: 'scan', language: 'de', extractedText: 'Einkommensteuerbescheid für das Jahr 2023. Nachzahlung 450 EUR fällig bis 15.02.2024.', summary: 'Steuerbescheid mit Nachzahlung von 450 EUR.', deadline: '15.02.2024', tags: ['Steuer', 'Finanzamt'], createdAt: '2024-02-01T09:30:00Z' },
  { id: '3', title: 'Arztbrief Dr. Müller', sourceType: 'image', language: 'de', isPrivate: true, extractedText: 'Sehr geehrte Kollegen, ich überweise den Patienten...', summary: 'Überweisung zum Facharzt.', deadline: null, tags: ['Gesundheit', 'Privat'], createdAt: '2024-03-10T14:00:00Z' },
];

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { documents, updateDocument } = useDocumentStore();

  const doc = MOCK_DOCS.find((d) => d.id === id) || documents.find((d) => d.id === id);

  if (!doc) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0f14', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6b7280' }}>Dokument nicht gefunden.</Text>
      </View>
    );
  }

  const handleAction = async (action: 'summary' | 'reply' | 'translation') => {
    const result = await runAiTask(action, doc.extractedText || '');
    Alert.alert(action.charAt(0).toUpperCase() + action.slice(1), result);
  };

  const handleDeadline = async () => {
    const d = await detectDeadline(doc.extractedText || '');
    Alert.alert('Deadline erkannt', d ? `Gefunden: ${d}` : 'Keine Deadline erkannt.');
  };

  const btnStyle = (color: string) => ({
    backgroundColor: color,
    padding: 13,
    borderRadius: 10,
    alignItems: 'center' as const,
    flex: 1,
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 20, gap: 14 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{doc.title}</Text>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Text style={{ backgroundColor: '#1f2937', color: '#9ca3af', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
            {doc.sourceType.toUpperCase()}
          </Text>
          {doc.deadline && (
            <Text style={{ backgroundColor: '#7c3aed22', color: '#a78bfa', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              📅 {doc.deadline}
            </Text>
          )}
        </View>

        {doc.summary && (
          <View style={{ backgroundColor: '#131920', borderRadius: 10, padding: 14 }}>
            <Text style={{ color: '#6b7280', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Zusammenfassung</Text>
            <Text style={{ color: '#c7d0d9', fontSize: 14 }}>{doc.summary}</Text>
          </View>
        )}

        {doc.extractedText && (
          <View style={{ backgroundColor: '#0f1923', borderRadius: 10, padding: 14 }}>
            <Text style={{ color: '#6b7280', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Extrahierter Text (OCR)</Text>
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>{doc.extractedText}</Text>
          </View>
        )}

        <Text style={{ color: '#6b7280', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Aktionen</Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={btnStyle('#1e3a5f')} onPress={() => handleAction('summary')}>
            <Text style={{ color: '#60a5fa', fontWeight: '600', fontSize: 13 }}>📝 Summary</Text>
          </Pressable>
          <Pressable style={btnStyle('#1a2e1a')} onPress={() => handleAction('reply')}>
            <Text style={{ color: '#4ade80', fontWeight: '600', fontSize: 13 }}>✉️ Reply</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={btnStyle('#2e1a3a')} onPress={() => handleAction('translation')}>
            <Text style={{ color: '#c084fc', fontWeight: '600', fontSize: 13 }}>🌐 Übersetzen</Text>
          </Pressable>
          <Pressable style={btnStyle('#1f2937')} onPress={handleDeadline}>
            <Text style={{ color: '#f59e0b', fontWeight: '600', fontSize: 13 }}>📅 Deadline</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 8, padding: 12, backgroundColor: '#131920', borderRadius: 10 }}>
          <Text style={{ color: '#4b5563', fontSize: 12 }}>Erstellt: {new Date(doc.createdAt).toLocaleString('de-DE')}</Text>
          {doc.language && <Text style={{ color: '#4b5563', fontSize: 12 }}>Sprache: {doc.language.toUpperCase()}</Text>}
        </View>
      </View>
    </ScrollView>
  );
}
