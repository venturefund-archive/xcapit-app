export class NativeTokenOf { }


fdescribe('NativeTokenOf', () => {

  let token: NativeTokenOf;

  beforeEach(() => {
    token = new NativeTokenOf();
  });

  it('new', () => {
    expect(token).toBeTruthy();
  });
});
