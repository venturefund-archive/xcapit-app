import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { InformationModalComponent } from './information-modal.component';

describe('InformationModalComponent', () => {
  let component: InformationModalComponent;
  let fixture: ComponentFixture<InformationModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [InformationModalComponent],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close information modal when click on close or understood button', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    fixture.debugElement.query(By.css('ion-button[name="Understood"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(2);
  });
});
