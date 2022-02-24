import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TEST_COINS } from '../../constants/coins.test';
import { CoinSelectorComponent } from './coin-selector.component';

describe('CoinSelectorComponent', () => {
  let component: CoinSelectorComponent;
  let fixture: ComponentFixture<CoinSelectorComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CoinSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinSelectorComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinSelectorComponent);
    component = fixture.componentInstance;
    component.selectedCoin = TEST_COINS[0];
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call changeCurrency event on click', () => {
    const spy = spyOn(component.changeCurrency, 'emit');
    fixture.debugElement.query(By.css('.cs')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Continue Button clicked', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Coin Selector Component');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
