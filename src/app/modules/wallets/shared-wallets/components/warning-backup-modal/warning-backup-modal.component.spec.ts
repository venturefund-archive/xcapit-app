import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

import { WarningBackupModalComponent } from './warning-backup-modal.component';

fdescribe('WarningBackupModalComponent', () => {
  let component: WarningBackupModalComponent;
  let fixture: ComponentFixture<WarningBackupModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ WarningBackupModalComponent ],
      imports: [IonicModule.forRoot(),
                TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WarningBackupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
