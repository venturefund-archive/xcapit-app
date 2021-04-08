import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UxCardInfoBinanceComponent } from './ux-card-info-binance.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';

describe('UxCardInfoBinanceComponent', () => {
  let component: UxCardInfoBinanceComponent;
  let fixture: ComponentFixture<UxCardInfoBinanceComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxCardInfoBinanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UxCardInfoBinanceComponent,
        TrackClickDirective,
        DummyComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
        RouterTestingModule.withRoutes([
          { path: 'tutorials/help', component: DummyComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UxCardInfoBinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when moreInfo is called', () => {
    spyOn(window, 'open');
    component.moreInfo();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when More Info button clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'More Info'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
