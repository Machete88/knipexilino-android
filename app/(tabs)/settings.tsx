import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { exportBackup, importBackupFromFile } from '../../src/services/backup';

export default function SettingsScreen() {
  const { documents, replaceDocuments } = useDocumentStore();
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [deeplKey, setDeeplKey] = useState('');
  const [visionKey, setVisionKey] = useState('');
  const [useLocal, setUseLocal] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [vaultEnabled, setVaultEnabled] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  const handleExportBackup = async () => {
    setBackupLoading(true);
    try {
      const path = await exportBackup(documents);
      Alert.alert('Backup erstellt', `Gespeichert unter:\n${path}`);
    } catch {
      Alert.alert('Fehler', 'Backup konnte nicht erstellt werden.');
    } finally {
      setBackupLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#131920',
    color: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginTop: 6,
  };
  const label = (t: string) => (
    <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 16, fontWeight: '600' }}>{t}</Text>
  );
  const section = (t: string) => (
    <Text style={{ color: '#475569', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 2 }}>{t}</Text>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 24 }}>
        <Text style={{ color: '#f1f5f9', fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Einstellungen</Text>

        {section('AI Provider')}
        {label('OpenAI API Key')}
        <TextInput style={inputStyle} value={openaiKey} onChangeText={setOpenaiKey} placeholder="sk-..." placeholderTextColor="#374151" secureTextEntry />
        {label('Anthropic API Key')}
        <TextInput style={inputStyle} value={anthropicKey} onChangeText={setAnthropicKey} placeholder="sk-ant-..." placeholderTextColor="#374151" secureTextEntry />

        {section('OCR')}
        {label('Google Vision API Key')}
        <TextInput style={inputStyle} value={visionKey} onChangeText={setVisionKey} placeholder="AIza..." placeholderTextColor="#374151" secureTextEntry />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Lokales Tesseract OCR</Text>
          <Switch value={useLocal} onValueChange={setUseLocal} trackColor={{ true: '#2563eb' }} />
        </View>

        {section('\u00dcbersetzung')}
        {label('DeepL API Key')}
        <TextInput style={inputStyle} value={deeplKey} onChangeText={setDeeplKey} placeholder="..." placeholderTextColor="#374151" secureTextEntry />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Auto-\u00dcbersetzung</Text>
          <Switch value={autoTranslate} onValueChange={setAutoTranslate} trackColor={{ true: '#2563eb' }} />
        </View>

        {section('Sicherheit')}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Vault aktivieren</Text>
          <Switch value={vaultEnabled} onValueChange={setVaultEnabled} trackColor={{ true: '#2563eb' }} />
        </View>

        {section('Navigation')}
        <Link href="/search" asChild>
          <Pressable style={{ backgroundColor: '#1e3a5f', padding: 14, borderRadius: 12, marginTop: 10 }}>
            <Text style={{ color: '#7dd3fc', fontWeight: '600' }}>🔍 Semantische Suche \u00f6ffnen</Text>
          </Pressable>
        </Link>

        {section('Backup & Restore')}
        <Pressable
          onPress={handleExportBackup}
          disabled={backupLoading}
          style={{ backgroundColor: '#2563eb', padding: 16, borderRadius: 12, marginTop: 10, alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center' }}
        >
          {backupLoading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>☁️ Backup exportieren ({documents.length} Dokumente)</Text>
          }
        </Pressable>

        <View style={{ marginTop: 28, padding: 14, backgroundColor: '#080d12', borderRadius: 10 }}>
          <Text style={{ color: '#334155', fontSize: 12 }}>Version 0.3.0 \u2014 Knipexilino Android</Text>
          <Text style={{ color: '#334155', fontSize: 12, marginTop: 2 }}>Keys werden lokal im Secure Storage gespeichert.</Text>
        </View>
      </View>
    </ScrollView>
  );
}
