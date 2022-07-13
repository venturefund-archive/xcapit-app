import { DummyFee } from "./dummy-fee";


describe('DummyFee', () => {

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
