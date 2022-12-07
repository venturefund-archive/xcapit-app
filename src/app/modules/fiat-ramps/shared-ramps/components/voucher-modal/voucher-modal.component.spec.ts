import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

import { VoucherModalComponent } from './voucher-modal.component';

describe('VoucherModalComponent', () => {
  let component: VoucherModalComponent;
  let fixture: ComponentFixture<VoucherModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ VoucherModalComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherModalComponent);
    component = fixture.componentInstance;
    component.voucher = jasmine.createSpyObj('Photo', {}, { dataUrl: '' });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when user clicks Close button', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
