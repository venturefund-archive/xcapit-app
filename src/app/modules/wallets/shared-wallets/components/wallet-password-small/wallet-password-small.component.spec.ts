import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletPasswordSmallComponent } from './wallet-password-small.component';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';

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
});
