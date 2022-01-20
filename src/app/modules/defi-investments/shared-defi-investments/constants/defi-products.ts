import twoPiABi from '../constants/twoPi-abi/twoPi-abi.json';
import { defiProduct } from '../interfaces/defi-product.interface';

export const PROD_DEFI_PRODUCTS: defiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
    abi: twoPiABi
  },
];

export const NONPROD_DEFI_PRODUCTS: defiProduct[] = [
  {
    id: 'mumbai_dai',
    isComing: false,
    abi: twoPiABi
  },
];
