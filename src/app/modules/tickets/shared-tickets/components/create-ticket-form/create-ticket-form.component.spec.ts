import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CreateTicketFormComponent } from './create-ticket-form.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('NetworkSelectCardComponent', () => {
  let component: CreateTicketFormComponent;
  let fixture: ComponentFixture<CreateTicketFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTicketFormComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTicketFormComponent);
    component = fixture.componentInstance;
    component.userEmail = 'test@test.com';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user email on init', () => {
    component.ngOnInit();
    expect(component.form.value.email).toEqual('test@test.com');
  });

  it('should set category if category exist on init', () => {
    component.category = 'Otros';
    component.ngOnInit();
    expect(component.form.value.subject).toEqual({ name: 'Otros', value: 'tickets.categories.others' });
  });

  it('should emit parsed form data to parent when Submit button is clicked and the form is valid', () => {
    const spy = spyOn(component.send, 'emit');
    component.form.patchValue({
      message: 'test message',
      subject: { name: 'Otros', value: 'tickets.categories.others' },
    });
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      subject: 'tickets.categories.others',
      category_code: 'Otros',
      message: 'test message',
    });
  });

  it('should show validation errors if the form is not valid', () => {
    const spy = spyOn(component.form, 'markAllAsTouched');
    component.form.patchValue({ message: '' });
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
