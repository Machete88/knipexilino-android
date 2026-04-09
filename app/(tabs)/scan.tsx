import { View, Text, Pressable, Alert } from 'react-native';
import { useDocumentStore } from '../../src/store/documentStore';
import { runOcrFromImage } from '../../src/services/ocr';
import { detectDeadline } from '../../src/services/deadline';
import { runAiTask } from '../../src/services/ai';
import { DocumentItem } from '../../src/types/document';

export default function ScanScreen() {
  const { addDocument } = useDocumentStore();

  const handleMockScan = async () => {
    const mockUri = 'mock://scan/document.jpg';
    const text = await runOcrFromImage(mockUri);
    const deadline = await detectDeadline(text + ' Frist: 30.06.2025');
    const summary = await runAiTask('summary', text);

    const doc: DocumentItem = {
      id: Date.now().toString(),
      title: `Scan ${new Date().toLocaleDateString('de-DE')}`,
      sourceType: 'scan',
      language: 'de',
      extractedText: text,
      summary,
      deadline,
      tags: ['Neu'],
      createdAt: new Date().toISOString(),
    };

    addDocument(doc);
    Alert.alert('Scan abgeschlossen', `Dokument "${doc.title}" wurde hinzugefügt.`);
  };

  const handleMockPdfImport = async () => {
    const doc: DocumentItem = {
      id: (Date.now() + 1).toString(),
      title: `Import PDF ${new Date().toLocaleDateString('de-DE')}`,
      sourceType: 'pdf',
      language: 'de',
      extractedText: 'Beispieltext aus importiertem PDF-Dokument.',
      summary: '[summary] Beispieltext aus importiertem PDF-Dokument.',
      deadline: null,
      tags: ['Import', 'PDF'],
      createdAt: new Date().toISOString(),
    };
    addDocument(doc);
    Alert.alert('Import abgeschlossen', `Dokument "${doc.title}" wurde hinzugefügt.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14', padding: 24, gap: 16 }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Scan / Import</Text>
      <Text style={{ color: '#9ca3af', fontSize: 14 }}>
        Kamera-Scan, PDF- oder Bild-Import. OCR läuft lokal oder via Google Vision API.
      </Text>

      <Pressable
        onPress={handleMockScan}
        style={{ backgroundColor: '#2563eb', padding: 18, borderRadius: 12, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>📷 Kamera-Scan (Platzhalter)</Text>
      </Pressable>

      <Pressable
        onPress={handleMockPdfImport}
        style={{ backgroundColor: '#1f2937', padding: 18, borderRadius: 12, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>📂 PDF / Bild importieren</Text>
      </Pressable>

      <Pressable
        style={{ backgroundColor: '#1f2937', padding: 18, borderRadius: 12, alignItems: 'center', opacity: 0.6 }}
        disabled
      >
        <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>📧 Aus E-Mail importieren (coming soon)</Text>
      </Pressable>

      <View style={{ marginTop: 8, padding: 14, backgroundColor: '#131920', borderRadius: 10 }}>
        <Text style={{ color: '#6b7280', fontSize: 12 }}>OCR-Engine: Tesseract (lokal) oder Google Vision API</Text>
        <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Unterstützte Formate: JPG, PNG, PDF, HEIC</Text>
      </View>
    </View>
  );
}
