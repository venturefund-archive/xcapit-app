import { Fake } from './fake.spec';

export class FakeNavController implements Fake {
  private readonly navigateForwardResponse: any;
  private readonly navigateBackResponse: any;
  private readonly navigateRootResponse: any;
  private spy: any;

  constructor(navigateForwardResponse = null, navigateBackResponse = null, navigateRootResponse = null) {
    this.navigateForwardResponse = navigateForwardResponse;
    this.navigateBackResponse = navigateBackResponse;
    this.navigateRootResponse = navigateRootResponse;
  }

  createSpy() {
    this.spy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack', 'navigateRoot']);
    this.modifyReturns(this.navigateForwardResponse, this.navigateBackResponse, this.navigateRootResponse);
    return this.spy;
  }

  modifyReturns(navigateForwardResponse, navigateBackResponse, navigateRootResponse) {
    this.spy.navigateForward.and.returnValue(Promise.resolve(this.navigateForwardResponse));
    this.spy.navigateBack.and.returnValue(Promise.resolve(this.navigateBackResponse));
    this.spy.navigateRoot.and.returnValue(Promise.resolve(this.navigateRootResponse));
  }
}
