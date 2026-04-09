export type DocumentItem = {
  id: string;
  title: string;
  sourceType: 'scan' | 'pdf' | 'image' | 'email';
  language?: string;
  extractedText?: string;
  summary?: string;
  deadline?: string | null;
  replyDraft?: string;
  translation?: string;
  tags?: string[];
  isPrivate?: boolean;
  createdAt: string;
};
