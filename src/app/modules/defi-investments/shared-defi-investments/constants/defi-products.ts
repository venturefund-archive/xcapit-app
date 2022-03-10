import { DefiProduct } from '../interfaces/defi-product.interface';

export const PROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
    weeklyEarning: true,
    category:'conservative',
  },
  {
    id: 'polygon_dai',
    isComing: false,
    weeklyEarning: true,
    category:'conservative',
  },
];

export const NONPROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'mumbai_usdc',
    isComing: false,
    weeklyEarning: true,
    category:'conservative',
  },
  {
    id: 'mumbai_dai',
    isComing: false,
    weeklyEarning: true,
    category:'conservative',
  },
  {
    id: 'mumbai_eth',
    isComing: true,
    weeklyEarning: false,
    category:'medium'
  },
];
