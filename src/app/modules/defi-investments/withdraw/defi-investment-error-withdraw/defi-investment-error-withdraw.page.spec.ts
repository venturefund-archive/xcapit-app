import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DefiInvestmentErrorWithdrawPage } from './defi-investment-error-withdraw.page';

describe('DefiInvestmentErrorWithdrawPage', () => {
  let component: DefiInvestmentErrorWithdrawPage;
  let fixture: ComponentFixture<DefiInvestmentErrorWithdrawPage>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let paramMapSpy: jasmine.SpyObj<ParamMap>;

  beforeEach(
    waitForAsync(() => {
      paramMapSpy = jasmine.createSpyObj('ParamMap', { get: 'mumbai_usdc' });
      activatedRouteSpy = jasmine.createSpyObj(
        'ActivatedRoute',
        {},
        {
          snapshot: { paramMap: paramMapSpy },
        }
      );
      TestBed.configureTestingModule({
        declarations: [DefiInvestmentErrorWithdrawPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(DefiInvestmentErrorWithdrawPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on will enter with vault', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });
});
