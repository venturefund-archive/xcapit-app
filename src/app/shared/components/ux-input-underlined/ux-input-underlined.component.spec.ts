import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UxInputUnderlinedComponent } from './ux-input-underlined.component';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('UxInputUnderlinedComponent', () => {
  let component: UxInputUnderlinedComponent;
  let fixture: ComponentFixture<UxInputUnderlinedComponent>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;

  beforeEach(() => {
    controlContainerMock = new FormGroup({
      testControlName: new FormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [UxInputUnderlinedComponent],
      imports: [IonicModule, ReactiveFormsModule],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UxInputUnderlinedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    component.controlName = 'testControlName';
    component.labelLeft = 'labelLeft';
    component.labelRight = 'labelRight';
    component.placeholder = 'testPlaceholder';
    component.maxlength = 5;
    component.readonly = false;
    component.debounce = 100;

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const input = fixture.debugElement.query(By.css('ion-input'));
    expect(input).toBeTruthy();

    expect(input.attributes['ng-reflect-placeholder']).toBe('testPlaceholder');
    expect(input.attributes.maxlength).toBe('5');
    expect(input.attributes['ng-reflect-readonly']).toBe('false');
    expect(input.attributes['ng-reflect-debounce']).toBe('100');

    const labels = fixture.debugElement.queryAll(By.css('ion-label'));
    expect(labels[0].nativeElement.innerHTML).toContain('labelLeft');
    expect(labels[1].nativeElement.innerHTML).toContain('labelRight');
  });
});
