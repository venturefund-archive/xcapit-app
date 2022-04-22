import { FakeBalance } from './fake-balance';

fdescribe('FakeBalance', () => {
  it('new', () => {
    expect(new FakeBalance(10)).toBeTruthy();
  });

  it('value', async () => {
    expect(await new FakeBalance(5).value()).toEqual(5);
  });
});
