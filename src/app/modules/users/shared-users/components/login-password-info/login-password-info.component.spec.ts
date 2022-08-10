import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { LoginPasswordInfoComponent } from './login-password-info.component';

describe('LoginPasswordInfoComponent', () => {
  let component: LoginPasswordInfoComponent;
  let fixture: ComponentFixture<LoginPasswordInfoComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  
  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [LoginPasswordInfoComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers:[{ provide: ModalController, useValue: modalControllerSpy },]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPasswordInfoComponent);
    component = fixture.componentInstance;
    component.title = 'test_title';
    component.subtitle = 'test_subtitle';
    component.image = 'assets/test_image.svg';
    component.button = 'test_button';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    fixture.detectChanges();

    const closeButtonEl =  fixture.debugElement.query(By.css('.lmi__footer ion-button'));
    const imgEl = fixture.debugElement.query(By.css('.lmi__img-container__img'));
    const titleEl = fixture.debugElement.query(By.css('.lmi__title ion-text'));
    const subtitletEl = fixture.debugElement.query(By.css('.lmi__subtitle ion-text'));
    const buttonEl = fixture.debugElement.query(By.css('.lmi__footer ion-button'));
    
    expect(closeButtonEl).toBeTruthy();
    expect(imgEl.nativeElement.src).toContain('/assets/test_image.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('test_title');
    expect(subtitletEl.nativeElement.innerHTML).toContain('test_subtitle');
    expect(buttonEl.nativeElement.innerHTML).toContain('test_button');
  });

  it('should dismiss modal when understood button is clicked', () => {
    fixture.debugElement.query(By.css('.lmi__footer ion-button')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss modal when close button is clicked', () => {
    fixture.debugElement.query(By.css('.lmi__close_button ion-button')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});


