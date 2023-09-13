import { FakeTranslateService } from '../../translate-service/fake/fake-translate-service';
import { Lender } from '../lender.interface';
import { rawLender } from '../raw-lender.fixture';
import { DefaultLender } from './default-lender';

describe('DefaultLender', () => {
  let lender: Lender;

  beforeEach(() => {
    lender = new DefaultLender(rawLender, new FakeTranslateService());
  });

  it('new', () => {
    expect(lender).toBeTruthy();
  });

  it('firstStepUrl', () => {
    expect(lender.firstStepUrl()).toEqual(rawLender.firstStepUrl);
  });

  it('xscrowAddress', () => {
    expect(lender.xscrowAddress()).toEqual(rawLender.xscrowAddress);
  });

  it('logo', () => {
    expect(lender.logo()).toEqual(rawLender.logo);
  });

  it('url', () => {
    expect(lender.url()).toEqual(rawLender.url);
  });

  it('json', () => {
    expect(lender.json()).toEqual(rawLender);
  });

  it('depositAddress', () => {
    expect(lender.depositAddress()).toEqual(rawLender.address);
  });

  it('minWarrantyAmount', () => {
    expect(lender.minWarrantyAmount()).toEqual(rawLender.minAmount.toString());
  });

  it('onRampProvider', () => {
    expect(lender.onRampProvider()).toEqual(rawLender.onRampProvider);
  });
});
