import * as FileSystem from 'expo-file-system';
import { DocumentItem } from '../types/document';

export async function exportBackup(documents: DocumentItem[]): Promise<string> {
  const payload = JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      documents,
    },
    null,
    2
  );

  const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? '';
  const path = `${dir}knipexilino-backup-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(path, payload, { encoding: FileSystem.EncodingType.UTF8 });
  return path;
}

export async function importBackupFromFile(path: string): Promise<DocumentItem[]> {
  const raw = await FileSystem.readAsStringAsync(path);
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.documents) ? (parsed.documents as DocumentItem[]) : [];
}
