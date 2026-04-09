import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useDocumentStore } from '../../src/store/documentStore';
import { runOcrFromImage } from '../../src/services/ocr';
import { detectDeadline } from '../../src/services/deadline';
import { generateSummary } from '../../src/services/ai';
import { DocumentItem } from '../../src/types/document';

export default function ScanScreen() {
  const { addDocument } = useDocumentStore();
  const [processing, setProcessing] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const processAndStore = async (
    uri: string,
    sourceType: DocumentItem['sourceType'],
    filename?: string
  ) => {
    setProcessing(true);
    try {
      const text = await runOcrFromImage(uri);
      const deadline = await detectDeadline(text);
      const summary = await generateSummary(text);
      const doc: DocumentItem = {
        id: Date.now().toString(),
        title: filename ?? `Scan ${new Date().toLocaleDateString('de-DE')}`,
        sourceType,
        language: 'de',
        extractedText: text,
        summary,
        deadline,
        tags: ['Neu'],
        createdAt: new Date().toISOString(),
      };
      await addDocument(doc);
      setLastAdded(doc.title);
    } finally {
      setProcessing(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await processAndStore(asset.uri, 'image', asset.fileName ?? undefined);
    }
  };

  const pickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Kamera-Zugriff', 'Bitte erlaube den Kamerazugriff in den Einstellungen.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!result.canceled && result.assets[0]) {
      await processAndStore(result.assets[0].uri, 'scan');
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const sourceType = asset.mimeType?.includes('pdf') ? 'pdf' : 'image';
      await processAndStore(asset.uri, sourceType, asset.name);
    }
  };

  const btn = (label: string, icon: string, onPress: () => void, color = '#1f2937') => (
    <Pressable
      onPress={onPress}
      disabled={processing}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#2a3645' : color,
        padding: 18,
        borderRadius: 14,
        alignItems: 'center' as const,
        flexDirection: 'row' as const,
        gap: 12,
        opacity: processing ? 0.6 : 1,
      })}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={{ color: '#f1f5f9', fontWeight: '600', fontSize: 16 }}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 24, gap: 14 }}>
        <Text style={{ color: '#f1f5f9', fontSize: 22, fontWeight: '700' }}>Scan / Import</Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20 }}>
          Foto aufnehmen, Bild oder PDF importieren. OCR extrahiert den Text automatisch.
        </Text>

        {processing ? (
          <View style={{ alignItems: 'center', padding: 32, gap: 12 }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ color: '#94a3b8' }}>Verarbeitung l\u00e4uft...</Text>
          </View>
        ) : (
          <>
            {btn('Kamera-Scan', '\ud83d\udcf7', pickCamera, '#1e3a5f')}
            {btn('Bild aus Galerie', '\ud83d\uddbc\ufe0f', pickImage)}
            {btn('PDF / Datei importieren', '\ud83d\udcc2', pickDocument)}
            <Pressable
              disabled
              style={{
                backgroundColor: '#111827',
                padding: 18,
                borderRadius: 14,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 12,
                opacity: 0.45,
              }}
            >
              <Text style={{ fontSize: 24 }}>\u2709\ufe0f</Text>
              <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>Aus E-Mail importieren (demnächst)</Text>
            </Pressable>
          </>
        )}

        {lastAdded && !processing && (
          <View style={{ backgroundColor: '#14532d', borderRadius: 12, padding: 14, marginTop: 8 }}>
            <Text style={{ color: '#4ade80', fontWeight: '600' }}>\u2705 Hinzugef\u00fcgt:</Text>
            <Text style={{ color: '#86efac', marginTop: 4 }}>{lastAdded}</Text>
          </View>
        )}

        <View style={{ marginTop: 8, padding: 14, backgroundColor: '#0f1923', borderRadius: 12 }}>
          <Text style={{ color: '#475569', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>OCR-Info</Text>
          <Text style={{ color: '#475569', fontSize: 12 }}>Engine: Tesseract (lokal) oder Google Vision API</Text>
          <Text style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>Formate: JPG, PNG, HEIC, PDF</Text>
          <Text style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>Sprachen: DE, EN und weitere</Text>
        </View>
      </View>
    </ScrollView>
  );
}
