import { DefiProduct } from '../interfaces/defi-product.interface';

export const PROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
    continuousEarning: true,
    category:'conservative',
  },
  {
    id: 'polygon_dai',
    isComing: false,
    continuousEarning: false,
    category:'conservative',
  },
  {
    id: 'polygon_btc',
    isComing: false,
    continuousEarning: true,
    category: 'medium',
  },
];

export const NONPROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'mumbai_usdc',
    isComing: false,
    continuousEarning: true,
    category:'conservative',
  },
  {
    id: 'mumbai_dai',
    isComing: false,
    continuousEarning: false,
    category:'conservative',
  },
  {
    id: 'mumbai_btc',
    isComing: false,
    continuousEarning: true,
    category:'medium'
  },
];
