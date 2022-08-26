export class FakeCovalentRepo {
  constructor() {}
}

fdescribe('FakeCovalentRepo', () => {
  it('new', () => {
    expect(new FakeCovalentRepo()).toBeTruthy();
  });
});
