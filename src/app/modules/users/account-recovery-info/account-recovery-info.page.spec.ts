import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { AccountRecoveryInfoPage } from './account-recovery-info.page';

describe('AccountRecoveryInfoPage', () => {
  let component: AccountRecoveryInfoPage;
  let fixture: ComponentFixture<AccountRecoveryInfoPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<AccountRecoveryInfoPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;


  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [ AccountRecoveryInfoPage, FakeTrackClickDirective ],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
      ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountRecoveryInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_recover_wallet clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_recover_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/wallets/create-first/disclaimer/import']);
  });

  it('should call trackEvent on trackService when ux_recover_no_phrase clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_recover_no_phrase');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/users/account-recovery']);
  });
});
