import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SelectWalletTypePage } from './select-wallet-type.page';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { FakeFeatureFlagDirective } from '../../../../testing/fakes/feature-flag-directive.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeLender } from 'src/app/shared/models/lender/fake/fake-lender';
import { ActiveLenderInjectable } from '../../../shared/models/active-lender/injectable/active-lender.injectable';
import { NullLenderX } from '../../../shared/models/lender/null/null-lender-x';
import { ActiveLender } from '../../../shared/models/active-lender/active-lender';

describe('SelectWalletTypePage', () => {
  let component: SelectWalletTypePage;
  let fixture: ComponentFixture<SelectWalletTypePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: {
        value: () => Promise.resolve(new FakeLender()),
      },
    });

    TestBed.configureTestingModule({
      declarations: [SelectWalletTypePage, FakeFeatureFlagDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectWalletTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to on-boarding when Close button is clicked', () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="Close button"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/users/on-boarding');
  });

  it('should not show lender card if active lender', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('app-wallet-type-card')).length).toEqual(2);
  });

  it('should not show lender card if active lender does not exist', async () => {
    activeLenderInjectableSpy.create.and.returnValue({
      value: () => Promise.resolve(new NullLenderX()),
    } as unknown as ActiveLender);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('app-wallet-type-card')).length).toEqual(1);
  });
});
