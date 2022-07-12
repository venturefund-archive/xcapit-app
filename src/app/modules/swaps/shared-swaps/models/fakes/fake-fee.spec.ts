import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";

export class FakeFee implements Fee { }


fdescribe('FakeFee', () => {

  it('new', () => {
    expect(new FakeFee()).toBeTruthy();
  });
});
