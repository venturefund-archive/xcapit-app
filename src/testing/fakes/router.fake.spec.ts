import { Fake } from './fake.spec';
import { Navigation, Router, UrlTree } from '@angular/router';

export class FakeRouter implements Fake {
  private readonly navigationState: any;
  private spy: jasmine.SpyObj<Router>;

  constructor(extras = null) {
    this.navigationState = extras;
  }

  createSpy(): any {
    this.spy = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
    this.modifyReturns(this.navigationState);
    return this.spy;
  }

  modifyReturns(extras = null) {
    this.spy.getCurrentNavigation.and.returnValue(this.getNavigation(extras));
  }

  private getNavigation(extras = null): Navigation {
    return {
      id: 2,
      initialUrl: new UrlTree(),
      extractedUrl: new UrlTree(),
      trigger: 'imperative',
      previousNavigation: null,
      extras: extras,
    } as Navigation;
  }
}
