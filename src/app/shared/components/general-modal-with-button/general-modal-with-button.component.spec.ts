import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { GeneralModalWithButtonComponent } from './general-modal-with-button.component';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';

describe('GeneralModalWithButtonComponent', () => {
  let component: GeneralModalWithButtonComponent;
  let fixture: ComponentFixture<GeneralModalWithButtonComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [GeneralModalWithButtonComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralModalWithButtonComponent);
    component = fixture.componentInstance;
    component.url = 'testUrl'
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close informative modal when Close clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should navigate to page when primary action is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Primary Action"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('testUrl');
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
