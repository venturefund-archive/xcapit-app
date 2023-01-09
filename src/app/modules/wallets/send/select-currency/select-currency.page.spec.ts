import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SelectCurrencyPage } from './select-currency.page';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeTrackClickDirective } from '../../../../../testing/fakes/track-click-directive.fake.spec';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { TokenSelectionListComponent } from '../../../../shared/components/token-selection-list/token-selection-list.component';
import { SuitePipe } from '../../../../shared/pipes/suite/suite.pipe';
import { rawTokensData, rawUSDTData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';


describe('SelectCurrencyPage', () => {
  let component: SelectCurrencyPage;
  let fixture: ComponentFixture<SelectCurrencyPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssetsSelected: Promise.resolve(rawTokensData),
    });
    TestBed.configureTestingModule({
      declarations: [SelectCurrencyPage, FakeTrackClickDirective, TokenSelectionListComponent, SuitePipe],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user selected coins of storage on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.coins).toEqual(rawTokensData);
  });

  it('should render a list of coins', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('app-token-selection-list'));
    expect(list).toBeTruthy();
  });

  it('should navigate when itemClicked event fired', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('app-token-selection-list')).triggerEventHandler('clickedCoin', rawUSDTData);

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['wallets/send/detail/blockchain', rawUSDTData.network, 'token',rawUSDTData.contract]);
  });

  it('should show no-active-tokens-card component when storage has no coins', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    storageServiceSpy.getAssetsSelected.and.returnValue(Promise.resolve([]));
    await fixture.whenStable();

    const cardEl = fixture.debugElement.query(By.css('app-no-active-tokens-card'))
    expect(cardEl).toBeTruthy();
  })
});
