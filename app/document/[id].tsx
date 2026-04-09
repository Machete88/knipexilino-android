import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { MOCK_DOCUMENTS } from '../../src/data/mockDocuments';
import { runAiTask } from '../../src/services/ai';
import { detectDeadline } from '../../src/services/deadline';
import { translateText } from '../../src/services/translation';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { documents, updateDocument, removeDocument } = useDocumentStore();

  const doc =
    MOCK_DOCUMENTS.find((d) => d.id === id) ??
    documents.find((d) => d.id === id);

  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; text: string } | null>(null);

  if (!doc) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0f14', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 40 }}>\ud83d\uddd1\ufe0f</Text>
        <Text style={{ color: '#6b7280', marginTop: 12 }}>Dokument nicht gefunden.</Text>
      </View>
    );
  }

  const run = async (label: string, fn: () => Promise<string>) => {
    setLoading(label);
    setResult(null);
    try {
      const text = await fn();
      setResult({ label, text });
    } catch (e: any) {
      Alert.alert('Fehler', e?.message ?? 'Unbekannter Fehler');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Dokument l\u00f6schen',
      `"${doc.title}" wirklich l\u00f6schen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'L\u00f6schen',
          style: 'destructive',
          onPress: async () => {
            await removeDocument(doc.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    await Share.share({
      title: doc.title,
      message: `${doc.title}\n\n${doc.summary ?? doc.extractedText ?? ''}`,
    });
  };

  const ActionBtn = ({
    label, icon, color, textColor, onPress,
  }: { label: string; icon: string; color: string; textColor: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      disabled={!!loading}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#1a2535' : color,
        padding: 13,
        borderRadius: 12,
        alignItems: 'center' as const,
        flex: 1,
        opacity: loading ? 0.6 : 1,
      })}
    >
      {loading === label ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
          <Text style={{ color: textColor, fontWeight: '600', fontSize: 12, marginTop: 4 }}>{label}</Text>
        </>
      )}
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 20, gap: 14 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ color: '#f1f5f9', fontSize: 20, fontWeight: '700', flex: 1, lineHeight: 28 }}>
            {doc.title}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={handleShare} style={{ padding: 8 }}>
              <Text style={{ fontSize: 18 }}>\ud83d\udce4</Text>
            </Pressable>
            {!doc.id.startsWith('mock') && (
              <Pressable onPress={handleDelete} style={{ padding: 8 }}>
                <Text style={{ fontSize: 18 }}>\ud83d\uddd1\ufe0f</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Meta badges */}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: '#1f2937', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>{doc.sourceType.toUpperCase()}</Text>
          </View>
          {doc.deadline && (
            <View style={{ backgroundColor: '#312e81', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#a5b4fc', fontSize: 12 }}>\ud83d\udcc5 {doc.deadline}</Text>
            </View>
          )}
          {doc.isPrivate && (
            <View style={{ backgroundColor: '#450a0a', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#f87171', fontSize: 12 }}>\ud83d\udd12 Privat</Text>
            </View>
          )}
          {doc.language && (
            <View style={{ backgroundColor: '#1f2937', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{doc.language.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        {doc.summary && (
          <View style={{ backgroundColor: '#0f1923', borderRadius: 12, padding: 14 }}>
            <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Zusammenfassung</Text>
            <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 22 }}>{doc.summary}</Text>
          </View>
        )}

        {/* OCR Text */}
        {doc.extractedText && (
          <View style={{ backgroundColor: '#080d12', borderRadius: 12, padding: 14 }}>
            <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Extrahierter Text (OCR)</Text>
            <Text style={{ color: '#64748b', fontSize: 13, lineHeight: 20 }}>{doc.extractedText}</Text>
          </View>
        )}

        {/* Tags */}
        {doc.tags && doc.tags.length > 0 && (
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {doc.tags.map((tag) => (
              <View key={tag} style={{ backgroundColor: '#1e3a5f', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: '#7dd3fc', fontSize: 12 }}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>KI-Aktionen</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ActionBtn
            label="Summary" icon="\ud83d\udcdd" color="#1e3a5f" textColor="#7dd3fc"
            onPress={() => run('Summary', () => runAiTask('summary', doc.extractedText ?? ''))}
          />
          <ActionBtn
            label="Reply" icon="\u2709\ufe0f" color="#14532d" textColor="#4ade80"
            onPress={() => run('Reply', () => runAiTask('reply', doc.extractedText ?? ''))}
          />
          <ActionBtn
            label="\u00dcbersetzen" icon="\ud83c\udf10" color="#2e1a3a" textColor="#c084fc"
            onPress={() => run('\u00dcbersetzen', () => translateText(doc.extractedText ?? '', 'EN'))}
          />
          <ActionBtn
            label="Deadline" icon="\ud83d\udcc5" color="#1c1100" textColor="#fbbf24"
            onPress={() =>
              run('Deadline', async () => {
                const d = await detectDeadline(doc.extractedText ?? '');
                return d ? `Deadline erkannt: ${d}` : 'Keine Deadline gefunden.';
              })
            }
          />
        </View>

        {/* Result Card */}
        {result && (
          <View style={{ backgroundColor: '#0f1a2e', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1e3a5f' }}>
            <Text style={{ color: '#3b82f6', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              {result.label}
            </Text>
            <Text style={{ color: '#93c5fd', fontSize: 14, lineHeight: 22 }}>{result.text}</Text>
          </View>
        )}

        {/* Footer meta */}
        <View style={{ padding: 12, backgroundColor: '#080d12', borderRadius: 10, gap: 2 }}>
          <Text style={{ color: '#334155', fontSize: 12 }}>Erstellt: {new Date(doc.createdAt).toLocaleString('de-DE')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
