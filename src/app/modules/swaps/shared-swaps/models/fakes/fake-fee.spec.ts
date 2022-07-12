export class FakeFee implements Fee { }


fdescribe('FakeFee', () => {

  it('new', () => {
    expect(new FakeFee()).toBeTruthy();
  });
});
