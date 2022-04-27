import { ZeroBalance } from './zero-balance';

describe('ZeroBalance', () => {
  it('should create', () => {
    expect(new ZeroBalance()).toBeTruthy();
  });

  it('should return zero on value', async () => {
    expect(await new ZeroBalance().value()).toEqual(0);
  });
});
