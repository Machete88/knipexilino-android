import { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { MOCK_DOCUMENTS } from '../../src/data/mockDocuments';

export default function HomeScreen() {
  const { documents, loaded, loadDocuments } = useDocumentStore();

  useEffect(() => {
    if (!loaded) loadDocuments();
  }, [loaded]);

  const total = MOCK_DOCUMENTS.length + documents.length;
  const withDeadline = [...MOCK_DOCUMENTS, ...documents].filter((d) => d.deadline).length;
  const privateCount = [...MOCK_DOCUMENTS, ...documents].filter((d) => d.isPrivate).length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 24, gap: 16 }}>
        <View>
          <Text style={{ color: '#f1f5f9', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>
            Knipexilino
          </Text>
          <Text style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            AI-Dokumentenmanager \u00b7 Android
          </Text>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Gesamt', value: total, color: '#3b82f6' },
            { label: 'Deadlines', value: withDeadline, color: '#a78bfa' },
            { label: 'Privat', value: privateCount, color: '#f87171' },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: '#131920',
                borderRadius: 14,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: s.color, fontSize: 26, fontWeight: '800' }}>{s.value}</Text>
              <Text style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Link href="/(tabs)/documents" asChild>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#1d4ed8' : '#2563eb',
              padding: 16,
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            })}
          >
            <Text style={{ fontSize: 22 }}>\ud83d\udcc4</Text>
            <View>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Dokumente \u00f6ffnen</Text>
              <Text style={{ color: '#bfdbfe', fontSize: 12 }}>{total} Dokumente gespeichert</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/(tabs)/scan" asChild>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#262e3a' : '#1f2937',
              padding: 16,
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            })}
          >
            <Text style={{ fontSize: 22 }}>\ud83d\udcf7</Text>
            <View>
              <Text style={{ color: '#f1f5f9', fontWeight: '700', fontSize: 16 }}>Scan / Import</Text>
              <Text style={{ color: '#64748b', fontSize: 12 }}>Kamera, Galerie oder PDF</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/(tabs)/settings" asChild>
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#262e3a' : '#1f2937',
              padding: 16,
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            })}
          >
            <Text style={{ fontSize: 22 }}>\u2699\ufe0f</Text>
            <View>
              <Text style={{ color: '#f1f5f9', fontWeight: '700', fontSize: 16 }}>Einstellungen</Text>
              <Text style={{ color: '#64748b', fontSize: 12 }}>API-Keys, OCR, Vault</Text>
            </View>
          </Pressable>
        </Link>

        {/* Feature list */}
        <View style={{ backgroundColor: '#0f1923', borderRadius: 14, padding: 16, gap: 10 }}>
          <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            Integrierte Services
          </Text>
          {[
            ['\ud83d\udd0d', 'OCR', 'Tesseract lokal oder Google Vision'],
            ['\ud83d\udcc5', 'Deadlines', 'Automatische Erkennung aus Text'],
            ['\u2709\ufe0f', 'Reply-KI', 'Antwortentw\u00fcrfe per GPT/Claude'],
            ['\ud83c\udf10', '\u00dcbersetzung', 'DeepL API, 30+ Sprachen'],
            ['\ud83d\udd0e', 'Suche', 'Keyword + semantisch (Embeddings)'],
            ['\ud83d\udd12', 'Vault', 'AES-256-verschl\u00fcsselte Dokumente'],
            ['\u2601\ufe0f', 'Backup', 'S3-kompatibler Cloud-Backup'],
            ['\ud83d\udce7', 'E-Mail', 'Import aus IMAP-Postfach'],
          ].map(([icon, name, desc]) => (
            <View key={name} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 16, marginTop: 1 }}>{icon}</Text>
              <View>
                <Text style={{ color: '#cbd5e1', fontSize: 14, fontWeight: '600' }}>{name}</Text>
                <Text style={{ color: '#475569', fontSize: 12 }}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
