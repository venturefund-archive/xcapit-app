import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

import { WithdrawInfoModalComponent } from './withdraw-info-modal.component';

describe('WithdrawInfoModalComponent', () => {
  let component: WithdrawInfoModalComponent;
  let fixture: ComponentFixture<WithdrawInfoModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WithdrawInfoModalComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(WithdrawInfoModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when Close is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should close modal when Understood is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Understood"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});