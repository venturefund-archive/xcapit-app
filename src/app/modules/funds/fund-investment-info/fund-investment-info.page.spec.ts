import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { FundInvestmentInfoPage } from './fund-investment-info.page';

describe('FundInvestmentInfoPage', () => {
  let component: FundInvestmentInfoPage;
  let fixture: ComponentFixture<FundInvestmentInfoPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundInvestmentInfoPage>;
  let activatedRouteSpy: any;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          strategy: 'Denali',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FundInvestmentInfoPage, TrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FundInvestmentInfoPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ion-text name should contain the title "Denali" when the param in url is Denali', () => {
    const name = fixture.debugElement.query(By.css('ion-text.name'));
    expect(name.nativeElement.innerHTML).toContain('Denali');
  });

  it('ion-text description should contain the description "Denali" when the param in url is Denali', () => {
    const name = fixture.debugElement.query(By.css('ion-text.description'));
    expect(name.nativeElement.innerHTML).toContain(
      'funds.fund_investment.card.profiles.volume_profile_strategies_USDT.info_description'
    );
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Invest Info Page');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to apikeys list when Invest Info Page button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Invest Info Page"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/list');
  });
});
