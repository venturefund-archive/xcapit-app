export const modalControllerSpy = jasmine.createSpyObj('ModalController', {
  create: Promise.resolve({
    present: () => Promise.resolve(),
    onWillDismiss: () => Promise.resolve({}),
    onDidDismiss: () => Promise.resolve({}),
  }),
  dismiss: Promise.resolve(),
});
