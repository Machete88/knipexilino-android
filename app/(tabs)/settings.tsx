import { useState, useEffect } from 'react';
import {
  View, Text, Pressable, Alert, ScrollView,
  TextInput, Switch, ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { exportBackup } from '../../src/services/backup';
import {
  getApiKey, setApiKey,
  getModel, setModel,
} from '../../src/services/ai';
import { getVisionKey, setVisionKey } from '../../src/services/ocr';
import { getDeeplKey, setDeeplKey } from '../../src/services/translation';
import { setVaultPassphrase } from '../../src/services/vault';

const OPENROUTER_MODELS = [
  'mistralai/mistral-7b-instruct',
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'anthropic/claude-3-haiku',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-flash-1.5',
  'meta-llama/llama-3-8b-instruct',
];

export default function SettingsScreen() {
  const { documents } = useDocumentStore();
  const [orKey, setOrKey] = useState('');
  const [orModel, setOrModel] = useState(OPENROUTER_MODELS[0]);
  const [visionKey, setVKey] = useState('');
  const [deeplKey, setDKey] = useState('');
  const [vaultPass, setVaultPass] = useState('');
  const [useLocal, setUseLocal] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [vaultEnabled, setVaultEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const [k, m, v, d] = await Promise.all([
        getApiKey(), getModel(), getVisionKey(), getDeeplKey(),
      ]);
      if (k) setOrKey(k);
      if (m) setOrModel(m);
      if (v) setVKey(v);
      if (d) setDKey(d);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        orKey ? setApiKey(orKey) : Promise.resolve(),
        setModel(orModel),
        visionKey ? setVisionKey(visionKey) : Promise.resolve(),
        deeplKey ? setDeeplKey(deeplKey) : Promise.resolve(),
        vaultPass ? setVaultPassphrase(vaultPass) : Promise.resolve(),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      Alert.alert('Fehler', 'Speichern fehlgeschlagen.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = async () => {
    setBackupLoading(true);
    try {
      const path = await exportBackup(documents);
      Alert.alert('Backup erstellt', path);
    } catch {
      Alert.alert('Fehler', 'Backup fehlgeschlagen.');
    } finally {
      setBackupLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#0f1923', color: '#f1f5f9', borderRadius: 8,
    padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#1f2937', marginTop: 6,
  };
  const S = (t: string) => (
    <Text style={{ color: '#475569', fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 1, marginTop: 24, marginBottom: 2 }}>{t}</Text>
  );
  const L = (t: string) => (
    <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 12, fontWeight: '600' as const }}>{t}</Text>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 24, paddingBottom: 48 }}>
        <Text style={{ color: '#f1f5f9', fontSize: 22, fontWeight: '700', marginBottom: 4 }}>Einstellungen</Text>
        <Text style={{ color: '#475569', fontSize: 13 }}>Keys werden verschlüsselt im Secure Store gespeichert.</Text>

        {S('OpenRouter AI')}
        {L('API Key')}
        <TextInput style={inputStyle} value={orKey} onChangeText={setOrKey}
          placeholder="sk-or-v1-..." placeholderTextColor="#374151" secureTextEntry />

        {L('Modell')}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {OPENROUTER_MODELS.map((m) => (
              <Pressable key={m} onPress={() => setOrModel(m)}
                style={{
                  backgroundColor: orModel === m ? '#2563eb' : '#1f2937',
                  paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                }}>
                <Text style={{ color: orModel === m ? '#fff' : '#94a3b8', fontSize: 12 }}>{m.split('/')[1]}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {S('OCR')}
        {L('Google Vision API Key')}
        <TextInput style={inputStyle} value={visionKey} onChangeText={setVKey}
          placeholder="AIza..." placeholderTextColor="#374151" secureTextEntry />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Lokales Tesseract (fallback)</Text>
          <Switch value={useLocal} onValueChange={setUseLocal} trackColor={{ true: '#2563eb' }} />
        </View>

        {S('Übersetzung')}
        {L('DeepL API Key (optional)')}
        <TextInput style={inputStyle} value={deeplKey} onChangeText={setDKey}
          placeholder="..." placeholderTextColor="#374151" secureTextEntry />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Auto-Übersetzung</Text>
          <Switch value={autoTranslate} onValueChange={setAutoTranslate} trackColor={{ true: '#2563eb' }} />
        </View>

        {S('Vault')}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>Vault aktivieren</Text>
          <Switch value={vaultEnabled} onValueChange={setVaultEnabled} trackColor={{ true: '#2563eb' }} />
        </View>
        {vaultEnabled && (
          <>
            {L('Vault Passphrase')}
            <TextInput style={inputStyle} value={vaultPass} onChangeText={setVaultPass}
              placeholder="Passphrase..." placeholderTextColor="#374151" secureTextEntry />
          </>
        )}

        {/* Save button */}
        <Pressable onPress={handleSave} disabled={saving}
          style={{
            backgroundColor: saved ? '#14532d' : '#2563eb',
            padding: 16, borderRadius: 14, alignItems: 'center',
            marginTop: 28, flexDirection: 'row', justifyContent: 'center', gap: 10,
          }}>
          {saving
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                {saved ? '✅ Gespeichert' : '💾 Keys speichern'}
              </Text>
          }
        </Pressable>

        {S('Navigation')}
        <Link href="/search" asChild>
          <Pressable style={{ backgroundColor: '#1e3a5f', padding: 14, borderRadius: 12, marginTop: 10 }}>
            <Text style={{ color: '#7dd3fc', fontWeight: '600' }}>🔍 Semantische Suche</Text>
          </Pressable>
        </Link>

        {S('Backup & Restore')}
        <Pressable onPress={handleExportBackup} disabled={backupLoading}
          style={{
            backgroundColor: '#1f2937', padding: 16, borderRadius: 12,
            marginTop: 10, alignItems: 'center', flexDirection: 'row',
            justifyContent: 'center', gap: 10,
          }}>
          {backupLoading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={{ color: '#94a3b8', fontWeight: '600' }}>☁️ Backup exportieren ({documents.length} Dok.)</Text>
          }
        </Pressable>

        <View style={{ marginTop: 32, padding: 14, backgroundColor: '#080d12', borderRadius: 10 }}>
          <Text style={{ color: '#334155', fontSize: 12 }}>v0.4.0 — OpenRouter + Google Vision aktiv</Text>
        </View>
      </View>
    </ScrollView>
  );
}
