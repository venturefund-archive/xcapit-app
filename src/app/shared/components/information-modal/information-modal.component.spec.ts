import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { InformationModalComponent } from './information-modal.component';
import { OPERATION_STATUS } from 'src/app/modules/fiat-ramps/shared-ramps/constants/operation-status';

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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationModalComponent);
    component = fixture.componentInstance;
    component.title = 'aTitle';
    component.status = OPERATION_STATUS[0].statuses[0];
    component.operationType = 'cash-in';
    component.description = 'aDescription'
    component.description2 = 'aDescription2'
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('ion-label.main__body__content__title'));
    const statusChipEl = fixture.debugElement.query(By.css('app-operation-status-chip'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-label.main__body__content__description'));
    const description2El = fixture.debugElement.query(By.css('ion-label.main__body__content__description2'));
    expect(titleEl.nativeElement.innerHTML).toContain('aTitle');
    expect(statusChipEl.nativeElement.statusName).toContain(OPERATION_STATUS[0].statuses[0].name);
    expect(statusChipEl.nativeElement.operationType).toContain('cash-in');
    expect(descriptionEl.nativeElement.innerHTML).toContain('aDescription');
    expect(description2El.nativeElement.innerHTML).toContain('aDescription2');
  });

  it('should close information modal when click on close or understood button', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    fixture.debugElement.query(By.css('ion-button[name="Understood"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(2);
  });
});
