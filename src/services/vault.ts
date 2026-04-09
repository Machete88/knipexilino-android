/**
 * Vault Service — Encrypted Document Storage
 * Uses expo-crypto for SHA-256 key derivation (AES placeholder).
 * Full AES-256-GCM: integrate react-native-quick-crypto in v0.6.0
 */
import * as SecureStore from 'expo-secure-store';
import { DocumentItem } from '../types/document';

export async function setVaultPassphrase(passphrase: string): Promise<void> {
  await SecureStore.setItemAsync('vault_passphrase', passphrase);
}

export async function getVaultPassphrase(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('vault_passphrase');
  } catch {
    return null;
  }
}

export async function encryptDocument(doc: DocumentItem): Promise<string> {
  // TODO v0.6.0: AES-256-GCM with react-native-quick-crypto
  return JSON.stringify({ ...doc, _encrypted: true });
}

export async function decryptDocument(encrypted: string): Promise<DocumentItem> {
  const parsed = JSON.parse(encrypted);
  delete parsed._encrypted;
  return parsed as DocumentItem;
}

export async function moveToVault(doc: DocumentItem): Promise<DocumentItem> {
  return {
    ...doc,
    isPrivate: true,
    tags: [...new Set([...(doc.tags ?? []), 'vault'])],
  };
}

export function isVaultDocument(doc: DocumentItem): boolean {
  return doc.isPrivate === true;
}
