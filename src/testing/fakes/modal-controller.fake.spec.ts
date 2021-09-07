import { Fake } from './fake.spec';

export class FakeModalController implements Fake {
  private readonly onWillDismissResponse: any;
  private readonly onDidDismissResponse: any;
  private spy: any;

  constructor(onWillDismissResponse = {}, onDidDismissResponse = {}) {
    this.onWillDismissResponse = onWillDismissResponse;
    this.onDidDismissResponse = onDidDismissResponse;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    this.modifyReturns(this.onWillDismissResponse, this.onDidDismissResponse);
    return this.spy;
  }

  modifyReturns(onWillDismissResponse, onDidDismissResponse): void {
    this.spy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onWillDismiss: () => Promise.resolve(onWillDismissResponse),
        onDidDismiss: () => Promise.resolve(onDidDismissResponse),
        dismiss: () => Promise.resolve(),
      })
    );
    this.spy.dismiss.and.returnValue(Promise.resolve());
  }
}
