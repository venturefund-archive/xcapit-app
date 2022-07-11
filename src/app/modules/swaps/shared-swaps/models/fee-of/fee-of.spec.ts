export class FeeOf { }


fdescribe('Fee Of', () => {

  it('new', () => {
    expect(new FeeOf(BigNumber.from(1000))).toBeTruthy();
  });
});
