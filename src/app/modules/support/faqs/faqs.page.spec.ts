import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { FaqsPage } from './faqs.page';

describe('FaqsPage', () => {
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let component: FaqsPage;
  let fixture: ComponentFixture<FaqsPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeActivatedRoute = new FakeActivatedRoute({ topic: 'wallet' });
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    TestBed.configureTestingModule({
      declarations: [FaqsPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }, { provide: NavController, useValue: navControllerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-faq component', () => {
    fixture.detectChanges();
    const appFaq = fixture.debugElement.queryAll(By.css('app-faq'));
    fixture.detectChanges();
    expect(appFaq).toBeTruthy();
  });

  it('should render properly', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.fq__title ion-text'));
    const headerEl = fixture.debugElement.query(By.css('.ux_toolbar ion-title'));
    expect(titleEl.nativeElement.innerHTML).toContain('support.support_wallet.title');
    expect(headerEl.nativeElement.innerHTML).toContain('support.support_wallet.header');
  });

});
