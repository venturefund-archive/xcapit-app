export class FakeModalController {
  create(): Promise<any> {
    return Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => ({ role: 'closed', data: 'aData' }),
    });
  }
}
