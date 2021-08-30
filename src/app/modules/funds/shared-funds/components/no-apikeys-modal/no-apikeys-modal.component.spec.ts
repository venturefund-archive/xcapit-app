import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

import { NoApikeysModalComponent } from './no-apikeys-modal.component';

describe('NoApikeysModalComponent', () => {
  let component: NoApikeysModalComponent;
  let fixture: ComponentFixture<NoApikeysModalComponent>;
  let navControllerSpy: any;
  let modalControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
      TestBed.configureTestingModule({
        declarations: [NoApikeysModalComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NoApikeysModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to apikeys register when Register New Key button is clicked', () => {
    const button = fixture.debugElement.query(By.css('ion-button[name="Register New Key"]'));
    button.nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/register');
  });

  it('should dismiss Modal when Register New Key button is clicked', () => {
    const button = fixture.debugElement.query(By.css('ion-button[name="Register New Key"]'));
    button.nativeElement.click();

    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
