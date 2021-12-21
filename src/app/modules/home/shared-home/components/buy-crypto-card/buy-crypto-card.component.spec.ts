import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BuyCryptoCardComponent } from './buy-crypto-card.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';

describe('BuyCryptoCardComponent', () => {
  let component: BuyCryptoCardComponent;
  let fixture: ComponentFixture<BuyCryptoCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<BuyCryptoCardComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BuyCryptoCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [FakeTrackClickDirective],
      }).compileComponents();

      fixture = TestBed.createComponent(BuyCryptoCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on card click', async () => {
    const spy = spyOn(component.clicked, 'emit');
    await fixture.whenRenderingDone();
    fixture.debugElement.query(By.css('.bcc')).nativeElement.click();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Buy Crypto button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Buy Crypto');
    const directive = trackClickDirectiveHelper.getDirective(el);

    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
