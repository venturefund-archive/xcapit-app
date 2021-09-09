export const modalControllerMock = {
  create: Promise.resolve({
    present: () => Promise.resolve(),
    onWillDismiss: () => Promise.resolve({}),
    onDidDismiss: () => Promise.resolve({}),
    dismiss: () => Promise.resolve(),
  }),
  dismiss: Promise.resolve(),
};
