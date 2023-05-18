import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { ProviderFeeInfoModalComponent } from './provider-fee-info-modal.component';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('ProviderFeeInfoModalComponent', () => {
  let component: ProviderFeeInfoModalComponent;
  let fixture: ComponentFixture<ProviderFeeInfoModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ ProviderFeeInfoModalComponent ],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderFeeInfoModalComponent);
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
