import { environment } from 'src/environments/environment';

export interface defiProduct {
  id: string;
  isComing: boolean;
}

export const PROD_DEFI_PRODUCTS: defiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
  },
];

export const NONPROD_DEFI_PRODUCTS: defiProduct[] = [
  {
    id: 'mumbai_dai',
    isComing: false,
  },
];

export class availableDefiProducts {
  static value(): defiProduct[] {
    return environment.environment === 'PRODUCCION' ? PROD_DEFI_PRODUCTS : NONPROD_DEFI_PRODUCTS;
  }
}
