import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

import { NewTokenInfoModalComponent } from './new-token-info-modal.component';

describe('NewTokenInfoModalComponent', () => {
  let component: NewTokenInfoModalComponent;
  let fixture: ComponentFixture<NewTokenInfoModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ NewTokenInfoModalComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers:[{ provide: ModalController, useValue: modalControllerSpy },]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTokenInfoModalComponent);
    component = fixture.componentInstance;
    component.title = 'test_title';
    component.subtitle = 'test_subtitle';
    component.image = 'assets/test_image.svg';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    fixture.detectChanges();

    const closeButtonEl =  fixture.debugElement.query(By.css('.ntim__close_button ion-button'));
    const imgEl = fixture.debugElement.query(By.css('.ntim__img-container__img img'));
    const titleEl = fixture.debugElement.query(By.css('.ntim__title ion-text'));
    const subtitletEl = fixture.debugElement.query(By.css('.ntim__subtitle ion-text'));
    
    
    expect(closeButtonEl).toBeTruthy();
    expect(imgEl.nativeElement.src).toContain('/assets/test_image.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('test_title');
    expect(subtitletEl.nativeElement.innerHTML).toContain('test_subtitle');
  });

  it('should dismiss modal when close button is clicked', () => {
    fixture.debugElement.query(By.css('.ntim__close_button ion-button')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

});
