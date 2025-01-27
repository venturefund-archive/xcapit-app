export interface FiatRampProvider {
  id: number;
  alias: string;
  name: string;
  logoRoute: string;
  newOperationRoute: string;
  description: string;
  disclaimer?: string;
  countries: string[];
  currencies?: { symbol: string; network: string }[];
  trackClickEventName: string;
  providerName?: string;
  showInfo?: boolean;
  quote?: number;
  usdQuote?: number;
  isBestQuote?: boolean;
}
