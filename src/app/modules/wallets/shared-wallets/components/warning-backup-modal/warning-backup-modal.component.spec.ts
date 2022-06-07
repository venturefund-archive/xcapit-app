import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { WarningBackupModalComponent } from './warning-backup-modal.component';

describe('WarningBackupModalComponent', () => {
  let component: WarningBackupModalComponent;
  let fixture: ComponentFixture<WarningBackupModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [WarningBackupModalComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WarningBackupModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to backup wallet and dismiss modal when user clicks backup', () => {
    fixture.debugElement.query(By.css('ion-button[name="Backup"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/recovery/read']);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('backup');
  });

  it('should dismiss modal when user clicks close', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('close');
  });

  it('should dismiss modal when user clicks skip', () => {
    fixture.debugElement.query(By.css('ion-button[name="Skip"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('skip');
  });
});
