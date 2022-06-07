import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { DonationsInvalidPasswordPage } from './donations-invalid-password.page';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DonationsInvalidPasswordPage', () => {
  let component: DonationsInvalidPasswordPage;
  let fixture: ComponentFixture<DonationsInvalidPasswordPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [DonationsInvalidPasswordPage],
        imports: [IonicModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DonationsInvalidPasswordPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on will enter', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeDefined();
  });

  it('should go back on retry click', () => {
    component.goBackToSummary();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith('/donations/summary-data');
  });
});
