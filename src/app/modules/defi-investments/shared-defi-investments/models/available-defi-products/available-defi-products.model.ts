import { NONPROD_DEFI_PRODUCTS } from './../../constants/defi-products';
import { PROD_DEFI_PRODUCTS } from '../../constants/defi-products';
import { environment } from 'src/environments/environment';
import { defiProduct } from '../../interfaces/defi-product.interface';

export class AvailableDefiProducts {
  private readonly env;
  constructor(env = environment.environment) {
    this.env = env;
  }
  value(): defiProduct[] {
    return this.env === 'PRODUCCION' ? PROD_DEFI_PRODUCTS : NONPROD_DEFI_PRODUCTS;
  }
}
