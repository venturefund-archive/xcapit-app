import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';

import { FundInvestmentInfoPage } from './fund-investment-info.page';

describe('FundInvestmentInfoPage', () => {
  let component: FundInvestmentInfoPage;
  let fixture: ComponentFixture<FundInvestmentInfoPage>;
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
        declarations: [FundInvestmentInfoPage],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FundInvestmentInfoPage);
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
});
