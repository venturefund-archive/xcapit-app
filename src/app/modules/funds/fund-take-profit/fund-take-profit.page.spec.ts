import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundTakeProfitPage } from './fund-take-profit.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
const formData = {
  valid: {
    take_profit: 15,
  },
};
describe('FundTakeProfitPage', () => {
  let component: FundTakeProfitPage;
  let fixture: ComponentFixture<FundTakeProfitPage>;
  let navControllerSpy: any;
  let fakeNavController: any;
  let fundDataStorageServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      fundDataStorageServiceSpy = jasmine.createSpyObj('FundDataStorageService', ['getData', 'setData']);
      fakeNavController = new FakeNavController(Promise.resolve());
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [FundTakeProfitPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          { provide: FundDataStorageService, useValue: fundDataStorageServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTakeProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not define takeProfit and profile when fundTakeProfit and fundRiskLevel keys doesnt exists inside fundDataStorageService on ionViewWillEnter', async () => {
    fundDataStorageServiceSpy.getData
      .withArgs('fundTakeProfit')
      .and.returnValue(Promise.resolve())
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve());
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.takeProfit).toBeFalsy();
    expect(component.profile).toBeFalsy();
  });

  it('should define takeProfit and profile when fundTakeProfit and fundRiskLevel keys exists inside fundDataStorageService on ionViewWillEnter', async () => {
    fundDataStorageServiceSpy.getData
      .withArgs('fundTakeProfit')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.takeProfit).toEqual(15);
    expect(component.profile).toEqual('volume_profile_strategies_USDT');
  });

  it('should set fundTakeProfit in storage and navigate to fund stop loss when form is submited', async () => {
    fundDataStorageServiceSpy.getData
      .withArgs('fundTakeProfit')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(true))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectTakeProfitComponent = fixture.debugElement.query(By.css('app-fund-select-take-profit'));
    selectTakeProfitComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(fundDataStorageServiceSpy.setData).toHaveBeenCalledOnceWith('fundTakeProfit', formData.valid);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-stop-loss']);
  });

  it('should render properly the header title', async () => {
    fundDataStorageServiceSpy.getData
      .withArgs('fundTakeProfit')
      .and.returnValue(Promise.resolve())
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve());
    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const headerTitle = fixture.debugElement.query(By.css('.ux_toolbar ion-title'));
    expect(headerTitle.nativeElement.innerText).toContain('funds.fund_take_profit.header');
  });
});
