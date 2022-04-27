import { Fake } from './fake.spec';

export class FakeProvider implements Fake {
  private spy: any;

  constructor() {}

  createSpy() {
    this.spy = jasmine.createSpyObj('Provider', {}, { _isProvider: true });
    return this.spy;
  }

  modifyReturns() {}
}
