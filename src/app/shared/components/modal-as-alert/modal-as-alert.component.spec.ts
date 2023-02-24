import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { ModalAsAlertComponent } from './modal-as-alert.component';

describe('ModalAsAlertComponent', () => {
  let component: ModalAsAlertComponent;
  let fixture: ComponentFixture<ModalAsAlertComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ModalAsAlertComponent],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAsAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss modal with "cancel" args when cancel button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="cancel"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('cancel');
  });

  it('should dismiss modal with "confirm" args when confirm button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="confirm"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('confirm');
  });
});
