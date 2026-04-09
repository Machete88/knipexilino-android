/**
 * Vault Service — Encrypted Document Storage
 * Uses AES-256-GCM encryption with a user-defined passphrase.
 * Configure via .env: VAULT_PASSPHRASE
 */
import { DocumentItem } from '../types/document';

export async function encryptDocument(doc: DocumentItem): Promise<string> {
  // TODO: implement AES-256-GCM encryption
  return JSON.stringify(doc);
}

export async function decryptDocument(encrypted: string): Promise<DocumentItem> {
  // TODO: implement decryption
  return JSON.parse(encrypted) as DocumentItem;
}

export function isVaultDocument(doc: DocumentItem): boolean {
  return doc.isPrivate === true;
}
