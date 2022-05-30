import { fakeAsync, tick } from '@angular/core/testing';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { DefiProduct } from '../../interfaces/defi-product.interface';
import { AvailableDefiProducts } from './available-defi-products.model';

const PROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'polygon_usdc',
    isComing: false,
    continuousEarning: true,
    category: 'conservative',
  },
];
const NONPROD_DEFI_PRODUCTS: DefiProduct[] = [
  {
    id: 'mumbai_usdc',
    isComing: false,
    continuousEarning: true,
    category: 'conservative',
  },
];

describe('AvailableDefiProducts', () => {
  let availableDefiProducts: AvailableDefiProducts;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  beforeEach(() => {
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigSpy', {
      getObject: PROD_DEFI_PRODUCTS,
    });
  });

  it('should create', () => {
    availableDefiProducts = new AvailableDefiProducts(remoteConfigSpy);
    expect(availableDefiProducts).toBeTruthy();
  });

  it('should return production defi products when environment is PRODUCCION', () => {
    availableDefiProducts = new AvailableDefiProducts(remoteConfigSpy);
    expect(availableDefiProducts.value()).toEqual(PROD_DEFI_PRODUCTS);
  });

  it('should return nonprod defi products when environment is PREPROD', fakeAsync(() => {
    remoteConfigSpy.getObject.and.returnValue(NONPROD_DEFI_PRODUCTS);
    availableDefiProducts = new AvailableDefiProducts(remoteConfigSpy);
    tick();
    expect(availableDefiProducts.value()).toEqual(NONPROD_DEFI_PRODUCTS);
  }));
});
