import { DefiProduct } from '../interfaces/defi-product.interface';

export const PROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
  },
];

export const NONPROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'mumbai_usdc',
    isComing: false,
  },
  {
    id: 'mumbai_dai',
    isComing: true,
  },
];
