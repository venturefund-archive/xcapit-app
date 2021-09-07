import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletPasswordComponent } from './wallet-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { modalControllerMock } from '../../../../../../testing/spies/modal-controller-mock.spec';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../../../../shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WalletPasswordComponent', () => {
  let component: WalletPasswordComponent;
  let fixture: ComponentFixture<WalletPasswordComponent>;
  let modalControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletPasswordComponent>;
  beforeEach(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
    TestBed.configureTestingModule({
      declarations: [WalletPasswordComponent, TrackClickDirective],
      imports: [IonicModule, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [TrackClickDirective, { provide: ModalController, useValue: modalControllerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modal controller dismiss on Confirm Password button is clicked and form is valid', async () => {
    component.form.patchValue({ password: 'testPass' });
    fixture.debugElement.query(By.css('ion-button[name="Confirm Password"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.handleSubmit();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('testPass');
  });

  it('should not call modal controller dismiss on Confirm Password button is clicked and form is invalid', async () => {
    component.form.patchValue({ password: '' });
    fixture.detectChanges();
    await fixture.whenStable();
    await component.handleSubmit();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
  });

  it('should call trackEvent on trackService when Confirm Password button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm Password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
