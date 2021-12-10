import { Fake } from './fake.spec';
import { LoadingService } from '../../app/shared/services/loading/loading.service';

export class FakeLoadingService implements Fake {
  private readonly showResponse: any;
  private readonly dismissResponse: any;
  private readonly showModalResponse: any;
  private readonly dismissModalResponse: any;
  private readonly enabledResponse: any;
  private spy: jasmine.SpyObj<LoadingService>;

  constructor(
    showResponse = {},
    dismissResponse = {},
    showModalResponse = {},
    dismissModalResponse = {},
    enabledResponse = true
  ) {
    this.showResponse = showResponse;
    this.dismissResponse = dismissResponse;
    this.showModalResponse = showModalResponse;
    this.dismissModalResponse = dismissModalResponse;
    this.enabledResponse = enabledResponse;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('LoadingService', ['show', 'dismiss', 'showModal', 'dismissModal', 'enabled']);
    this.modifyReturns(
      this.showResponse,
      this.dismissResponse,
      this.showModalResponse,
      this.dismissModalResponse,
      this.enabledResponse
    );
    return this.spy;
  }

  modifyReturns(showResponse, dismissResponse, showModalResponse, dismissModalResponse, enabledResponse): void {
    this.spy.show.and.resolveTo(showResponse);
    this.spy.dismiss.and.resolveTo(dismissResponse);
    this.spy.showModal.and.resolveTo(showModalResponse);
    this.spy.dismissModal.and.resolveTo(dismissModalResponse);
    this.spy.enabled.and.returnValue(enabledResponse);
  }
}
