import { DefiProduct } from '../interfaces/defi-product.interface';

export const PROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
    weeklyEarning: true,
  },
];

export const NONPROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'mumbai_usdc',
    isComing: false,
    weeklyEarning: true,
  },
  {
    id: 'mumbai_dai',
    isComing: false,
    weeklyEarning: true,
  },
  {
    id: 'mumbai_eth',
    isComing: true,
    weeklyEarning: false,
  },
];
