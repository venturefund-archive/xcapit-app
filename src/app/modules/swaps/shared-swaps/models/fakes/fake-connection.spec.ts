export class FakeConnection {}

fdescribe('Fake Connection', () => {

  it('new', () => {
    expect(new FakeConnection()).toBeTruthy();
  });

it('send transaction', () => {
  expect(false).toBeTruthy();
});

});
