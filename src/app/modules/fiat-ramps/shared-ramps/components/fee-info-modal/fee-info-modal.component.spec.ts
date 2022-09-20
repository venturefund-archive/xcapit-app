import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FeeInfoModalComponent } from './fee-info-modal.component';

describe('FeeInfoModalComponent', () => {
  let component: FeeInfoModalComponent;
  let fixture: ComponentFixture<FeeInfoModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [FeeInfoModalComponent],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when button is clicked', async () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    fixture.debugElement.query(By.css('ion-button[name="Understood"]')).nativeElement.click();

    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(2);
  });
});
