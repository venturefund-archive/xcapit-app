export class FakeConnection { }
describe('Fake Connection', () => {

    it('new', () => {
      expect(new FakeConnection()).toBeTruthy();
    });

  });
