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

  it('present', async () => {
    const controller = await fakeModalController.create();
    await expectAsync(controller.present()).toBeResolved();
  });

  it('onDidDismiss', async () => {
    const controller = await fakeModalController.create();
    expect((await controller.onDidDismiss()).role).toEqual('closed');
  });
});
