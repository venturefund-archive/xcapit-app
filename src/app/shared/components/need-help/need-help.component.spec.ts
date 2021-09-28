import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NeedHelpComponent } from './need-help.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('NeedHelpComponent', () => {
  let component: NeedHelpComponent;
  let fixture: ComponentFixture<NeedHelpComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NeedHelpComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NeedHelpComponent, FakeTrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(NeedHelpComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when moreInfo is called', () => {
    spyOn(window, 'open');
    component.moreInfo();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should prefetch browser when ngOnInit is called', () => {
    const prefetchSpy = spyOn(component, 'prefetchInfoPage');
    component.ngOnInit();
    expect(prefetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Help link clicked', () => {
    spyOn(component, 'moreInfo');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when WhatsApp Help link clicked', () => {
    component.whatsAppLink = 'test';
    fixture.detectChanges();
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'WhatsApp Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Telegram Help link clicked', () => {
    component.telegramLink = 'test';
    fixture.detectChanges();
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Telegram Help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
