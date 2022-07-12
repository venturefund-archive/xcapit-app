import { DummyFee } from './fake-fee';


fdescribe('FakeFee', () => {

  let fee: DummyFee;
  const testData = 100;

  beforeEach(() => {
    fee = new DummyFee(testData);
  });

  it('new', () => {
    expect(fee).toBeTruthy();
  });

  it('value', async () => {
    expect((await fee.value()).eq(testData)).toBeTrue();
  });
});
