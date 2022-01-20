import { PROD_DEFI_PRODUCTS, NONPROD_DEFI_PRODUCTS } from './../../constants/defi-products';
import { AvailableDefiProducts } from './available-defi-products.model';

describe('AvailableDefiProducts', () => {
  let availableDefiProducts: AvailableDefiProducts;
  beforeEach(() => {});

  it('should create', () => {
    availableDefiProducts = new AvailableDefiProducts();
    expect(availableDefiProducts).toBeTruthy();
  });

  it('should return production defi products when environment is PRODUCCION', () => {
    availableDefiProducts = new AvailableDefiProducts('PRODUCCION');
    expect(availableDefiProducts.value()).toEqual(PROD_DEFI_PRODUCTS);
  });

  it('should return nonprod defi products when environment is PREPROD', () => {
    availableDefiProducts = new AvailableDefiProducts('PREPROD');
    expect(availableDefiProducts.value()).toEqual(NONPROD_DEFI_PRODUCTS);
  });
});
