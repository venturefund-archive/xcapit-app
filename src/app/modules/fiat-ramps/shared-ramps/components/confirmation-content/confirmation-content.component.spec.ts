import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationContentComponent } from './confirmation-content.component';

describe('ConfirmationContentComponent', () => {
  let component: ConfirmationContentComponent;
  let fixture: ComponentFixture<ConfirmationContentComponent>;
  const data = { step_from: 1, title: 'testTitle', items: 'testItems' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationContentComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationContentComponent);
    component = fixture.componentInstance;
    component.data = data;
    component.image = 'assets/test_image.svg';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when back button is clicked', () => {
    const spy = spyOn(component.back, 'emit');
    fixture.debugElement.query(By.css('ion-button.cc__button-back')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit when reload button is clicked', () => {
    const spy = spyOn(component.reload, 'emit');
    fixture.debugElement.query(By.css('ion-button.cc__footer__upload-button__button')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit when confirm button is clicked', () => {
    const spy = spyOn(component.confirm, 'emit');
    fixture.debugElement.query(By.css('ion-button.cc__footer__confirmation__button')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('div.cc__container__title > ion-text'));
    const itemsEl = fixture.debugElement.query(By.css('div.cc__container__description > ion-text'));
    const imageEl = fixture.debugElement.query(By.css('div.cc__container__image > img'));

    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');
    expect(itemsEl.nativeElement.innerHTML).toContain('testItems');
    expect(imageEl.attributes.src).toEqual('assets/test_image.svg');
  });
});
