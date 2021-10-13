import { Fake } from './fake.spec';

export class FakeNavController implements Fake {
  private readonly navigateForwardResponse: any;
  private readonly navigateBackResponse: any;
  private readonly navigateRootResponse: any;
  private readonly consumeTransitionResponse: any;
  private spy: any;

  constructor(
    navigateForwardResponse = null,
    navigateBackResponse = null,
    navigateRootResponse = null,
    consumeTransitionResponse = null
  ) {
    this.navigateForwardResponse = navigateForwardResponse;
    this.navigateBackResponse = navigateBackResponse;
    this.navigateRootResponse = navigateRootResponse;
    this.consumeTransitionResponse = consumeTransitionResponse;
  }

  createSpy() {
    this.spy = jasmine.createSpyObj('NavController', [
      'navigateForward',
      'navigateBack',
      'navigateRoot',
      'consumeTransition',
    ]);
    this.modifyReturns(
      this.navigateForwardResponse,
      this.navigateBackResponse,
      this.navigateRootResponse,
      this.consumeTransitionResponse
    );
    return this.spy;
  }

  modifyReturns(navigateForwardResponse, navigateBackResponse, navigateRootResponse, consumeTransitionResponse) {
    this.spy.navigateForward.and.returnValue(Promise.resolve(navigateForwardResponse));
    this.spy.navigateBack.and.returnValue(Promise.resolve(navigateBackResponse));
    this.spy.navigateRoot.and.returnValue(Promise.resolve(navigateRootResponse));
    this.spy.consumeTransition.and.returnValue(Promise.resolve(consumeTransitionResponse));
  }
}
