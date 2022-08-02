import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { SkipProfileTestComponent } from './skip-profile-test.component';

describe('SkipProfileTestComponent', () => {
  let component: SkipProfileTestComponent;
  let fixture: ComponentFixture<SkipProfileTestComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
     
    TestBed.configureTestingModule({
      declarations: [ SkipProfileTestComponent ],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SkipProfileTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate and close modal when out button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="out_skip_test"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith([component.homeWalletUrl]);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should close modal when cancel button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="cancel_skip_test"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
