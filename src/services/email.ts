/**
 * Email Service
 * Import documents from email attachments or IMAP inbox.
 * Configure via .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */
export type EmailAttachment = {
  filename: string;
  mimeType: string;
  data: string; // base64
};

export async function fetchEmailAttachments(): Promise<EmailAttachment[]> {
  // TODO: implement IMAP client (imap-simple or similar)
  return [];
}

export async function sendReplyEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  // TODO: implement SMTP send
  console.log(`Email reply placeholder to ${to}: ${subject}`);
}
