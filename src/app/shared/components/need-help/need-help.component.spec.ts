import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NeedHelpComponent } from './need-help.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { BrowserService } from '../../services/browser/browser.service';
import { By } from '@angular/platform-browser';

describe('NeedHelpComponent', () => {
  let component: NeedHelpComponent;
  let fixture: ComponentFixture<NeedHelpComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NeedHelpComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  beforeEach(
    waitForAsync(() => {
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      TestBed.configureTestingModule({
        declarations: [NeedHelpComponent, FakeTrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(NeedHelpComponent);
      component = fixture.componentInstance;
      component.whatsAppLink = 'https://bit.ly/XcapitAPISupportW';
      component.telegramLink = 'https://bit.ly/XcapitAPISupportT';
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Go To Help link clicked and open browser', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open browser when Go To Help link clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Go To Help"')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://www.info.xcapit.com/' });
  });

  it('should call trackEvent on trackService when WhatsApp Help button clicked', () => {
    component.whatsAppLink = 'test';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'WhatsApp Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open browser when WhatsApp Help button clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="WhatsApp Help"')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://bit.ly/XcapitAPISupportW' });
  });

  it('should call trackEvent on trackService when Telegram Help button clicked', () => {
    component.telegramLink = 'test';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Telegram Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open browser when Telegram Help button clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Telegram Help"')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://bit.ly/XcapitAPISupportT' });
  });
});
