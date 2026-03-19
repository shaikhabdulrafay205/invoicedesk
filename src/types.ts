export interface Service {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'PKR';

export interface ProposalData {
  freelancerName: string;
  freelancerEmail: string;
  freelancerPhone: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  projectDescription: string;
  services: Service[];
  currency: Currency;
  paymentTerms: string;
  dueDate: string;
  thankYouNote: string;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: '₨',
};
