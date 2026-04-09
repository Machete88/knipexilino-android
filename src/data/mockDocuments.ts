import { DocumentItem } from '../types/document';

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'mock-1',
    title: 'Mietvertrag 2024',
    sourceType: 'pdf',
    language: 'de',
    extractedText:
      'Hiermit wird ein Mietvertrag zwischen Vermieter Mustermann und Mieter Schmidt geschlossen. ' +
      'Die Kaltmiete betr\u00e4gt 850 EUR monatlich. K\u00fcndigung bis 31.12.2024.',
    summary: 'Mietvertrag f\u00fcr Wohnung, g\u00fcltig ab 01.01.2024. Kaltmiete 850 EUR/Monat.',
    deadline: '31.12.2024',
    tags: ['Wohnung', 'Vertrag', 'Miete'],
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'mock-2',
    title: 'Steuerbescheid 2023',
    sourceType: 'scan',
    language: 'de',
    extractedText:
      'Einkommensteuerbescheid f\u00fcr das Jahr 2023. Nachzahlung 450 EUR f\u00e4llig bis 15.02.2024. ' +
      'Bitte \u00fcberweisen Sie den Betrag auf das Konto des Finanzamts.',
    summary: 'Steuerbescheid mit Nachzahlung von 450\u00a0EUR. F\u00e4llig 15.02.2024.',
    deadline: '15.02.2024',
    tags: ['Steuer', 'Finanzamt', 'Pflicht'],
    createdAt: '2024-02-01T09:30:00Z',
  },
  {
    id: 'mock-3',
    title: 'Arztbrief Dr. M\u00fcller',
    sourceType: 'image',
    language: 'de',
    isPrivate: true,
    extractedText:
      'Sehr geehrte Frau Kollegin, ich \u00fcberweise den Patienten zur weiteren Abkl\u00e4rung. ' +
      'Diagnose: Verdacht auf Bandscheibenvorfall L4/L5.',
    summary: '\u00dcberweisung zum Facharzt. Diagnose: Bandscheibenvorfall L4/L5.',
    deadline: null,
    tags: ['Gesundheit', 'Privat'],
    createdAt: '2024-03-10T14:00:00Z',
  },
  {
    id: 'mock-4',
    title: 'Versicherungspolice KFZ',
    sourceType: 'pdf',
    language: 'de',
    extractedText:
      'Kfz-Versicherung f\u00fcr Fahrzeug BMW 320d. Pr\u00e4mie 612 EUR j\u00e4hrlich. ' +
      'F\u00e4lligkeit: 01.03.2025. Versicherungsnummer: KFZ-2024-88221.',
    summary: 'KFZ-Versicherung BMW 320d, j\u00e4hrliche Pr\u00e4mie 612\u00a0EUR.',
    deadline: '01.03.2025',
    tags: ['KFZ', 'Versicherung'],
    createdAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'mock-5',
    title: 'Gehaltsabrechnung M\u00e4rz 2024',
    sourceType: 'email',
    language: 'de',
    extractedText:
      'Gehaltsabrechnung f\u00fcr den Monat M\u00e4rz 2024. Bruttogehalt: 4.200 EUR. ' +
      'Nettobetrag: 2.748 EUR. Steuerklasse 1.',
    summary: 'Gehaltsabrechnung M\u00e4rz 2024. Netto 2.748\u00a0EUR.',
    deadline: null,
    tags: ['Gehalt', 'Arbeit'],
    createdAt: '2024-04-01T07:00:00Z',
  },
];
