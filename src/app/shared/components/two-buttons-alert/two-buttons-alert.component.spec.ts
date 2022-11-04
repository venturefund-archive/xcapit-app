import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TwoButtonsAlertComponent } from './two-buttons-alert.component';
import { By } from '@angular/platform-browser';

describe('TwoButtonsAlertComponent', () => {
  let component: TwoButtonsAlertComponent;
  let fixture: ComponentFixture<TwoButtonsAlertComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [TwoButtonsAlertComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoButtonsAlertComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', async () => {
    fixture.debugElement.query(By.css('ion-button[name="cancel"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(null, 'cancel');
  });

  it('should confirm modal', async () => {
    fixture.debugElement.query(By.css('ion-button[name="confirm"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(null, 'confirm');
  });
});
