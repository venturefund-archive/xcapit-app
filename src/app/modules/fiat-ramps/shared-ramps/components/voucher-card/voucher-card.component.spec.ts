import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { VoucherCardComponent } from './voucher-card.component';
import { Photo } from '@capacitor/camera';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

describe('VoucherCardComponent', () => {
  let component: VoucherCardComponent;
  let fixture: ComponentFixture<VoucherCardComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  const photo: Photo = {
    dataUrl: 'assets/img/coins/ETH.svg',
    format: '',
    saved: true,
  };

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [VoucherCardComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when there is no voucher', () => {
    const el = fixture.debugElement.query(By.css('.vc__file'));
    expect(el).toBeTruthy();
  });

  it('should show loader state when percentage is greater than zero', () => {
    component.percentage = 100;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.vc__loader'));
    expect(el).toBeTruthy();
  });

  it('should open modal voucher when the image is clicked', () => {
    component._percentage = -1;
    component.voucher = photo;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.vc__success__photo')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not allow to open multiple modals', () => {
    component._percentage = -1;
    component.voucher = photo;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('.vc__success__photo')).nativeElement;
    buttonEl.click();
    buttonEl.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
