import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UxInputUnderlinedComponent } from './ux-input-underlined.component';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UxLoadingBlockComponent } from '../ux-loading-block/ux-loading-block.component';

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
      declarations: [UxInputUnderlinedComponent, UxLoadingBlockComponent],
      imports: [IonicModule, ReactiveFormsModule],
      providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UxInputUnderlinedComponent);
    component = fixture.componentInstance;
    component.controlName = 'testControlName';
    component.labelLeft = 'labelLeft';
    component.labelRight = 'labelRight';
    component.placeholder = 'testPlaceholder';
    component.maxlength = 5;
    component.readonly = false;
    component.debounce = 100;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
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

  it('should render loading if loading', async () => {
    component.loading = false;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('#loading'))).toBeNull();
    component.loading = true;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(fixture.debugElement.query(By.css('#loading'))).not.toBeNull();
  });
});
