import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { DynamicLink } from '../dynamic-link';
import { DynamicLinkInjectable } from './dynamic-link-injectable';

describe('DynamicLinkInjectable', () => {
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  it('new', () => {
    expect(new DynamicLinkInjectable(browserServiceSpy, navControllerSpy)).toBeTruthy();
  });

  it('create', () => {
    expect(new DynamicLinkInjectable(browserServiceSpy, navControllerSpy).create('testURL')).toBeInstanceOf(
      DynamicLink
    );
  });
});
