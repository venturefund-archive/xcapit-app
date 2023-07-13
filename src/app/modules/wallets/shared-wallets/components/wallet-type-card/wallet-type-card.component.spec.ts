import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { WalletTypeCardComponent } from './wallet-type-card.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { WalletInitializeProcess } from '../../services/wallet-initialize-process/wallet-initialize-process';
import { rawLender } from 'src/app/shared/models/lender/raw-lender.fixture';

describe('WalletTypeCardComponent', () => {
  let component: WalletTypeCardComponent;
  let fixture: ComponentFixture<WalletTypeCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletTypeCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let walletInitializeProcessSpy: jasmine.SpyObj<WalletInitializeProcess>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    walletInitializeProcessSpy = jasmine.createSpyObj('WalletInitializeProcess', {
      setWarrantyWallet: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [WalletTypeCardComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletInitializeProcess, useValue: walletInitializeProcessSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTypeCardComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component.option = rawLender;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to lender steps when button is clicked', () => {
    fixture.debugElement.query(By.css('div.wtc')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(rawLender.firstStepUrl);
  });

  it('should save wallet type when button is clicked', () => {
    fixture.debugElement.query(By.css('div.wtc')).nativeElement.click();
    fixture.detectChanges();
    expect(walletInitializeProcessSpy.setWarrantyWallet).toHaveBeenCalledOnceWith(true);
  });

  it('should track click type when button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'Select Lender');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
