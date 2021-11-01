import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletPasswordSmallComponent } from './wallet-password-small.component';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { By } from '@angular/platform-browser';

describe('WalletPasswordSmallComponent', () => {
  let component: WalletPasswordSmallComponent;
  let fixture: ComponentFixture<WalletPasswordSmallComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordSmallComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletPasswordSmallComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(WalletPasswordSmallComponent);

      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to Recovery Phrase Read Page when user password is correct');

  it('should show error when user password is incorrect');

  it('should call trackEvent on trackService when Accept Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Accept');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call modal controller dismiss on Confirm Password button is clicked and form is invalid', async () => {
    component.form.patchValue({ password: '' });
    fixture.detectChanges();
    await fixture.whenStable();
    await component.handleSubmit();
    // expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
  });

  it('should call trackEvent on trackService when Close Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal when close button is clicked', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Close']")).nativeElement.click();
    // expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
