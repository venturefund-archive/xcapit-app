import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentProductCardComponent } from './investment-product-card.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

const testProduct = {
  profile: 'volume_profile_strategies_USDT',
  min_capital: '150',
  annual_interest: '90.96',
  percentage: '',
  link_info: '',
  risk: 2,
  currency: 'USDT',
};
describe('InvestmentProductCardComponent', () => {
  let component: InvestmentProductCardComponent;
  let fixture: ComponentFixture<InvestmentProductCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestmentProductCardComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [InvestmentProductCardComponent, FakeTrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();
    })
  );

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

  it('should emit data to parent on button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Invest');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to funds/fund-investment-info when moreInfo is called', () => {
    component.moreInfo();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'funds/fund-investment-info',
      component.productData.title,
    ]);
  });
});
