import { rawBlockchainsData } from "../../fixtures/raw-blockchains-data";
import { BlockchainsFactory } from "./blockchains.factory";


describe('Blockchain Factory', () => {

  it('new', () => {
    expect(new BlockchainsFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(new BlockchainsFactory().create(rawBlockchainsData)).toBeTruthy();
  });
});
