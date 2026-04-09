import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 24, gap: 16 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 4 }}>
          Knipexilino
        </Text>
        <Text style={{ color: '#c7d0d9', fontSize: 16, marginBottom: 8 }}>
          Android-first AI document manager — OCR, Deadlines, Reply, Übersetzung & Suche.
        </Text>

        <Link href="/(tabs)/documents" asChild>
          <Pressable style={{ backgroundColor: '#2563eb', padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>📄 Dokumente öffnen</Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/scan" asChild>
          <Pressable style={{ backgroundColor: '#1f2937', padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>📷 Scan / Import</Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/settings" asChild>
          <Pressable style={{ backgroundColor: '#1f2937', padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>⚙️ Einstellungen</Text>
          </Pressable>
        </Link>

        <View style={{ marginTop: 16, padding: 16, backgroundColor: '#131920', borderRadius: 12, gap: 8 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>Features</Text>
          {[
            '🔍 OCR — Text aus Bild/PDF extrahieren',
            '📅 Deadline-Erkennung automatisch',
            '✉️ Reply-Entwürfe per AI generieren',
            '🌐 Übersetzung in 30+ Sprachen',
            '🔎 Semantische Dokumentensuche',
            '🔒 Vault für vertrauliche Dokumente',
            '☁️ Backup & Restore',
            '📧 E-Mail-Integration',
          ].map((f, i) => (
            <Text key={i} style={{ color: '#c7d0d9', fontSize: 14 }}>{f}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
