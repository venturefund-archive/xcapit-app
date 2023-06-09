import { FakeModalController } from './fake-modal-controller';

fdescribe('FakeModalController', () => {
  let fakeModalController: FakeModalController;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
  });

  it('new', () => {
    expect(fakeModalController).toBeTruthy();
  });

  it('create', async () => {
    await expectAsync(fakeModalController.create()).toBeResolved();
  });
});
