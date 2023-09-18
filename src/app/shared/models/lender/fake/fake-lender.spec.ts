import { rawLender } from '../raw-lender.fixture';
import { FakeLender } from './fake-lender';

describe('FakeLender', () => {
  let fakeLender: FakeLender;

  beforeEach(() => {
    fakeLender = new FakeLender();
  });

  it('new', () => {
    expect(fakeLender).toBeTruthy();
  });

  it('firstStepUrl', () => {
    expect(fakeLender.firstStepUrl()).toEqual(rawLender.firstStepUrl);
  });
  
  it('buyOrDepositModalHeader', () => {
    expect(fakeLender.buyOrDepositModalHeader()).toEqual(rawLender.buyOrDepositModalHeader);
  });

  it('hasCryptoModalDescription', () => {
    expect(fakeLender.hasCryptoModalDescription()).toEqual(rawLender.hasCryptoModalDescription);
  });

  it('infoModalHighlightedHeader', () => {
    expect(fakeLender.infoModalHighlightedHeader()).toEqual(rawLender.infoModalHighlightedHeader);
  });

  it('logo', () => {
    expect(fakeLender.logo()).toEqual(rawLender.logo);
  });

  it('url', () => {
    expect(fakeLender.url()).toEqual(rawLender.url);
  });

  it('xscrowAddress', () => {
    expect(fakeLender.xscrowAddress()).toEqual(rawLender.xscrowAddress);
  });

  it('language', () => {
    expect(fakeLender.language()).toEqual(rawLender.language);
  });
  
  it('json', () => {
    expect(fakeLender.json()).toEqual(rawLender);
  });

  it('no default value', () => {
    const anAddress = '0x0';

    expect(new FakeLender({ ...rawLender, address: anAddress }).depositAddress()).toEqual(anAddress);
  });
});
