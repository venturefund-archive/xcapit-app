import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { KycDisclaimerModalComponent } from './kyc-disclaimer-modal.component';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';

describe('KycDisclaimerModalComponent', () => {
  let component: KycDisclaimerModalComponent;
  let fixture: ComponentFixture<KycDisclaimerModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<KycDisclaimerModalComponent>;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = new FakeModalController().createSpy();

      TestBed.configureTestingModule({
        declarations: [KycDisclaimerModalComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(KycDisclaimerModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss modal when close button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close KYC Modal"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss modal when Begin button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Begin KYC Flow"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Close KYC Modal button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close KYC Modal');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Begin KYC Flow button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Begin KYC Flow');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
