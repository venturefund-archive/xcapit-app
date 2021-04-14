export const alertControllerMock = {
  create: Promise.resolve({
    present: () => Promise.resolve(),
    onDidDismiss: () => Promise.resolve({}),
  }),
};
