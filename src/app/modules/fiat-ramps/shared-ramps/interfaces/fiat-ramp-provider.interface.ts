export interface FiatRampProvider {
  id: number;
  alias: string;
  name: string;
  logoRoute: string;
  newOperationRoute: string;
  description: string;
  disclaimer?: string;
  countries: string[];
  trackClickEventName: string;
  currencies?: { symbol: string; network: string }[];
}
