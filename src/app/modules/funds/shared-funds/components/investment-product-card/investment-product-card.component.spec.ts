import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentProductCardComponent } from './investment-product-card.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { DummyComponent } from 'src/testing/dummy.component.spec';

const testProduct = {
  profile: 'volume_profile_strategies_USDT',
  min_capital: '150',
  annual_interest: '90.96',
  percentage: '',
  link_info: '',
  risk: 2,
  currency: 'USDT'
};
describe('InvestmentProductCardComponent', () => {
  let component: InvestmentProductCardComponent;
  let fixture: ComponentFixture<InvestmentProductCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestmentProductCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        InvestmentProductCardComponent,
        TrackClickDirective,
        DummyComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentProductCardComponent);
    component = fixture.componentInstance;
    component.product = testProduct;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit data to parent on button clicked', async (done) => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Invest'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call window.open when moreInfo is called', () => {
    spyOn(window, 'open');
    component.moreInfo();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
