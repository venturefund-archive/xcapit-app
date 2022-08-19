import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { NewSuccessNoWalletPage } from './new-success-no-wallet.page';

describe('NewSuccessNoWalletPage', () => {
  let component: NewSuccessNoWalletPage;
  let fixture: ComponentFixture<NewSuccessNoWalletPage>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute(null, { email: 'test@test.com' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeNavController = new FakeNavController(null, null, Promise.resolve());
    navControllerSpy = fakeNavController.createSpy();
    translateSpy = jasmine.createSpyObj('TranslateService', { instant: 'test text' }, {});

    TestBed.configureTestingModule({
      declarations: [NewSuccessNoWalletPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: TranslateService, useValue: translateSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewSuccessNoWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace textSecondary with user email', () => {
    component.successType.textSecondary = 'test';
    component.ionViewWillEnter();

    expect(translateSpy.instant).toHaveBeenCalledOnceWith('test', { email: 'test@test.com' });
  });

  it('should navigate to create new ticket on primaryActionEvent', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-success-content')).triggerEventHandler('primaryActionEvent');

    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/tickets/new-create-support-ticket', {
      animationDirection: 'forward',
    });
  });
});
