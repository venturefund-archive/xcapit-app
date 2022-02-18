import { DefiProduct } from '../interfaces/defi-product.interface';

export const PROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
    weeklyProfit: true,
  },
];

export const NONPROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'mumbai_usdc',
    isComing: false,
    weeklyProfit: true,
  },
  {
    id: 'mumbai_dai',
    isComing: false,
    weeklyProfit: true,
  },
  {
    id: 'mumbai_eth',
    isComing: true,
    weeklyProfit: false,
  },
];
