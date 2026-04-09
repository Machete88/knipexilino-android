import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { searchDocuments } from '../src/services/search';
import { useDocumentStore } from '../src/store/documentStore';
import { MOCK_DOCUMENTS } from '../src/data/mockDocuments';
import { DocumentItem } from '../src/types/document';

export default function SearchScreen() {
  const { documents } = useDocumentStore();
  const allDocs = [...MOCK_DOCUMENTS, ...documents];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocumentItem[]>(allDocs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(allDocs);
      return;
    }
    setLoading(true);
    searchDocuments(query, allDocs)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [query, documents]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14', padding: 20 }}>
      <Text style={{ color: '#f1f5f9', fontSize: 22, fontWeight: '700', marginBottom: 14 }}>
        🔍 Semantische Suche
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Suchbegriff eingeben..."
        placeholderTextColor="#4b5563"
        autoFocus
        style={{
          backgroundColor: '#131920',
          color: '#f1f5f9',
          borderRadius: 12,
          padding: 14,
          fontSize: 15,
          borderWidth: 1,
          borderColor: '#1f2937',
          marginBottom: 10,
        }}
      />

      <Text style={{ color: '#475569', fontSize: 12, marginBottom: 10 }}>
        {results.length} Treffer
      </Text>

      {loading ? (
        <ActivityIndicator color="#2563eb" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <Link href={`/document/${item.id}`} asChild>
              <Pressable
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#1a2535' : '#131920',
                  borderRadius: 12,
                  padding: 14,
                })}
              >
                <Text style={{ color: '#f1f5f9', fontWeight: '600', fontSize: 15 }}>
                  {item.title}
                </Text>
                {item.summary ? (
                  <Text style={{ color: '#64748b', marginTop: 4, fontSize: 13 }} numberOfLines={2}>
                    {item.summary}
                  </Text>
                ) : null}
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {item.deadline && (
                    <Text style={{ color: '#a5b4fc', fontSize: 11 }}>📅 {item.deadline}</Text>
                  )}
                  {item.tags?.map((t) => (
                    <Text key={t} style={{ color: '#7dd3fc', fontSize: 11 }}>#{t}</Text>
                  ))}
                </View>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 36 }}>\ud83d\udcad</Text>
              <Text style={{ color: '#6b7280', marginTop: 10 }}>Keine Treffer f\u00fcr "{query}"</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
