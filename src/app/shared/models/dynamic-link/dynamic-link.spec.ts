import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { DynamicLink } from './dynamic-link';

describe('DynamicLink', () => {
  let dynamicLink: DynamicLink;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(() => {
    navControllerSpy = new FakeNavController().createSpy();
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    dynamicLink = new DynamicLink('https://app.xcapit.com/tabs/wallets', browserServiceSpy, navControllerSpy);
  });

  it('new', () => {
    expect(dynamicLink).toBeTruthy();
  });

  it('should navigate inside the app when the url is internal', () => {
    dynamicLink.redirect();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('tabs/wallets');
    expect(browserServiceSpy.open).not.toHaveBeenCalled();
  });

  it('should open in-app browser when the url is external', () => {
    const externalDynamicLink = new DynamicLink(
      'https://app.xcapit.com/links/https://test.com/',
      browserServiceSpy,
      navControllerSpy
    );
    externalDynamicLink.redirect();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://test.com/' });
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });

  it('should not navigate or open any link in browser when link is from wallet connect', () => {
    const externalDynamicLink = new DynamicLink('https://app.xcapit.com/links/wc', browserServiceSpy, navControllerSpy);
    externalDynamicLink.redirect();
    expect(browserServiceSpy.open).not.toHaveBeenCalled();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
