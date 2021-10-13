import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

import { SelectModalNewComponent } from './select-modal-new.component';
const data = [
  { name: 'testName', value: 'testValue' },
  { name: 'testName2', value: 'testValue2' },
];
describe('SelectModalNewComponent', () => {
  let component: SelectModalNewComponent;
  let fixture: ComponentFixture<SelectModalNewComponent>;
  let fakeModalController: FakeModalController;
  let spyModalController: any;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController({}, {});
      spyModalController = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SelectModalNewComponent],
        imports: [IonicModule, ReactiveFormsModule, TranslateModule.forRoot()],
        providers: [{ provide: ModalController, useValue: spyModalController }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectModalNewComponent);
      component = fixture.componentInstance;
      component.data = data;
      component.key = 'name';
      component.valueKey = 'value';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly when translated is true', () => {
    component.title = 'testTitle';
    component.translated = true;
    component.selected = data[0];
    component.ngOnInit();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('ion-text.sm__header__text'));
    const radioLabel = fixture.debugElement.queryAll(By.css('ion-label.sm__content__radio_label'));
    const radioValue = fixture.debugElement.queryAll(By.css('ion-radio.sm__content__radio_value'));
    expect(title.nativeElement.innerHTML).toContain('testTitle');
    expect(radioLabel.length).toEqual(2);
    expect(radioValue.length).toEqual(2);
    expect(radioLabel[0].nativeElement.innerHTML).toContain('testName');
    expect(radioLabel[1].nativeElement.innerHTML).toContain('testName2');
    expect(component.form.value.radio).toEqual(data[0]);
  });

  it('should render properly when translated is false', () => {
    fixture.detectChanges();
    const radioLabel = fixture.debugElement.queryAll(By.css('ion-label.sm__content__radio_label'));
    expect(radioLabel[0].nativeElement.innerHTML).toContain('testName');
    expect(radioLabel[1].nativeElement.innerHTML).toContain('testName2');
    expect(component.form.value.radio).toBeFalsy();
  });

  it('should close modal and emit event on dismiss', async () => {
    const targetEl = fixture.debugElement.query(By.css('ion-radio-group')).nativeElement;
    const customEvent = new CustomEvent('ionChange', { detail: { value: data[0] } });
    targetEl.dispatchEvent(customEvent);
    fixture.detectChanges();
    expect(spyModalController.dismiss).toHaveBeenCalledOnceWith(data[0], 'selected');
  });

  it('should be closed on close click ', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    fixture.detectChanges();
    expect(spyModalController.dismiss).toHaveBeenCalledTimes(1);
  });
});
