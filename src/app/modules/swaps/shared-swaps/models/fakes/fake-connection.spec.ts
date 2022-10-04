export class FakeConnection {}

fdescribe('Fake Connection', () => {
  let connection: FakeConnection;

beforeEach(() => {
  connection = new FakeConnection();
});


  it('new', () => {
    expect(connection).toBeTruthy();
  });

  it('send transaction', () => {
    expect(connection.sendTransaction()).toBeTruthy();
  });
});
