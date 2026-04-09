import { View, Text, TextInput, Switch, ScrollView } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [deeplKey, setDeeplKey] = useState('');
  const [visionKey, setVisionKey] = useState('');
  const [useLocal, setUseLocal] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [vaultEnabled, setVaultEnabled] = useState(false);

  const inputStyle = {
    backgroundColor: '#131920',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginTop: 6,
  };

  const labelStyle = { color: '#9ca3af', fontSize: 13, marginTop: 16, fontWeight: '600' as const };
  const sectionStyle = { color: '#6b7280', fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 1, marginTop: 24, marginBottom: 4 };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Einstellungen</Text>

        <Text style={sectionStyle}>AI Provider</Text>
        <Text style={labelStyle}>OpenAI API Key</Text>
        <TextInput style={inputStyle} value={openaiKey} onChangeText={setOpenaiKey} placeholder="sk-..." placeholderTextColor="#4b5563" secureTextEntry />

        <Text style={labelStyle}>Anthropic API Key</Text>
        <TextInput style={inputStyle} value={anthropicKey} onChangeText={setAnthropicKey} placeholder="sk-ant-..." placeholderTextColor="#4b5563" secureTextEntry />

        <Text style={sectionStyle}>OCR</Text>
        <Text style={labelStyle}>Google Vision API Key</Text>
        <TextInput style={inputStyle} value={visionKey} onChangeText={setVisionKey} placeholder="AIza..." placeholderTextColor="#4b5563" secureTextEntry />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#c7d0d9', fontSize: 14 }}>Lokales Tesseract OCR verwenden</Text>
          <Switch value={useLocal} onValueChange={setUseLocal} trackColor={{ true: '#2563eb' }} />
        </View>

        <Text style={sectionStyle}>Übersetzung</Text>
        <Text style={labelStyle}>DeepL API Key</Text>
        <TextInput style={inputStyle} value={deeplKey} onChangeText={setDeeplKey} placeholder="..." placeholderTextColor="#4b5563" secureTextEntry />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#c7d0d9', fontSize: 14 }}>Auto-Übersetzung aktivieren</Text>
          <Switch value={autoTranslate} onValueChange={setAutoTranslate} trackColor={{ true: '#2563eb' }} />
        </View>

        <Text style={sectionStyle}>Sicherheit</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#c7d0d9', fontSize: 14 }}>Vault (verschlüsselte Dokumente)</Text>
          <Switch value={vaultEnabled} onValueChange={setVaultEnabled} trackColor={{ true: '#2563eb' }} />
        </View>

        <View style={{ marginTop: 32, padding: 14, backgroundColor: '#131920', borderRadius: 10 }}>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Version 0.1.0 — MVP Scaffold</Text>
          <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Keys werden lokal im Secure Storage gespeichert.</Text>
        </View>
      </View>
    </ScrollView>
  );
}
