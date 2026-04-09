import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';
import { useDocumentStore } from '../../src/store/documentStore';
import { MOCK_DOCUMENTS } from '../../src/data/mockDocuments';
import { DocumentItem } from '../../src/types/document';
import { searchDocuments } from '../../src/services/search';

const SOURCE_ICON: Record<string, string> = {
  pdf: '\ud83d\udcc4',
  scan: '\ud83d\udcf8',
  image: '\ud83d\uddbc\ufe0f',
  email: '\u2709\ufe0f',
};

export default function DocumentsScreen() {
  const { documents, loaded, loadDocuments } = useDocumentStore();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<DocumentItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const allDocs = [...MOCK_DOCUMENTS, ...documents];

  useEffect(() => {
    if (!loaded) loadDocuments();
  }, [loaded]);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered(allDocs);
    } else {
      searchDocuments(query, allDocs).then(setFiltered);
    }
  }, [query, documents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: DocumentItem }) => (
    <Link href={`/document/${item.id}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#1a2535' : '#131920',
          borderRadius: 14,
          padding: 16,
          marginBottom: 10,
        })}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <Text style={{ fontSize: 20 }}>{SOURCE_ICON[item.sourceType] ?? '\ud83d\udcc4'}</Text>
            <Text style={{ color: '#f1f5f9', fontWeight: '700', fontSize: 15, flex: 1 }} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          {item.isPrivate && (
            <Text style={{ color: '#f87171', fontSize: 13 }}>\ud83d\udd12</Text>
          )}
        </View>

        {item.summary ? (
          <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 5, marginLeft: 28 }} numberOfLines={2}>
            {item.summary}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', marginTop: 10, gap: 6, flexWrap: 'wrap', marginLeft: 28 }}>
          {item.deadline && (
            <View style={{ backgroundColor: '#312e81', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: '#a5b4fc', fontSize: 11 }}>\ud83d\udcc5 {item.deadline}</Text>
            </View>
          )}
          {item.tags?.slice(0, 3).map((tag) => (
            <View key={tag} style={{ backgroundColor: '#1e3a5f', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: '#7dd3fc', fontSize: 11 }}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={{ color: '#475569', fontSize: 11, marginTop: 8, marginLeft: 28 }}>
          {new Date(item.createdAt).toLocaleDateString('de-DE')}
        </Text>
      </Pressable>
    </Link>
  );

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0f14', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#2563eb" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <View style={{ padding: 14, paddingBottom: 8 }}>
        <TextInput
          style={{
            backgroundColor: '#131920',
            color: '#f1f5f9',
            borderRadius: 10,
            padding: 12,
            fontSize: 14,
            borderWidth: 1,
            borderColor: '#1f2937',
          }}
          placeholder="\ud83d\udd0d Dokumente durchsuchen..."
          placeholderTextColor="#4b5563"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <Text style={{ color: '#475569', fontSize: 12, paddingHorizontal: 16, paddingBottom: 6 }}>
        {filtered.length} Dokument{filtered.length !== 1 ? 'e' : ''}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14, paddingTop: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 40 }}>\ud83d\udcc2</Text>
            <Text style={{ color: '#6b7280', marginTop: 12, fontSize: 15 }}>Keine Dokumente gefunden.</Text>
            <Text style={{ color: '#4b5563', marginTop: 4, fontSize: 13 }}>Scan oder Import starten.</Text>
          </View>
        }
      />
    </View>
  );
}
