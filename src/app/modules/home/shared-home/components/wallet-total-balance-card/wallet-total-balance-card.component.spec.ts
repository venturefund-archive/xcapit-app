import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HideTextPipe } from 'src/app/shared/pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletTotalBalanceCardComponent } from './wallet-total-balance-card.component';

describe('WalletTotalBalanceCardComponent', () => {
  let component: WalletTotalBalanceCardComponent;
  let fixture: ComponentFixture<WalletTotalBalanceCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletTotalBalanceCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let localStorageService: LocalStorageService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      localStorageServiceSpy = jasmine.createSpyObj(
        'LocalStorageService',
        {
          toggleHideFunds: undefined,
        },
        { hideFunds: of(false) }
      );
      localStorageServiceSpy.toggleHideFunds.and.callThrough();
      TestBed.configureTestingModule({
        declarations: [WalletTotalBalanceCardComponent, HideTextPipe, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: LocalStorageService, useValue: localStorageServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletTotalBalanceCardComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      localStorageService = TestBed.inject(LocalStorageService);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when ux_create_go_to_home_wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_create_go_to_home_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home wallet when ux_create_go_to_home_wallet is clicked', () => {
    fixture.debugElement.query(By.css('div[name="ux_create_go_to_home_wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['tabs/wallets']);
  });

  it('should render balance card when wallet exist', async () => {
    component.walletExist = true;
    component.hideFundText = false;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.wbc__content_balance__body__balance'));
    expect(divEl.nativeElement.innerHTML).toContain('0.00');
  });

  it('should show title and subtitle when wallet not exist', async () => {
    component.walletExist = false;
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('div.wbc__content__body__title'));
    const subtitleEl = fixture.debugElement.query(By.css('div.wbc__content__body__subtitle'));
    expect(titleEl.nativeElement.innerHTML).toContain('home.home_page.want_my_wallet.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('home.home_page.want_my_wallet.subtitle');
  });

  it('should hide balance when eye button is clicked', async () => {
    component.walletExist = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const eyeEl = fixture.debugElement.query(By.css('a.wbc__content_balance__body__eye-button'));
    eyeEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(localStorageServiceSpy.toggleHideFunds).toHaveBeenCalled();
    component.hideFundText = true;
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.css('div.wbc__content_balance__body__balance'));
    expect(divEl.nativeElement.innerHTML).toContain('****');
  });
});
