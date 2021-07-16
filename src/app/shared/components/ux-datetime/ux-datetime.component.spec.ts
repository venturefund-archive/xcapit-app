import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxDatetimeComponent } from './ux-datetime.component';
import { FormGroupDirective } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('UxDatetimeComponent', () => {
  let component: UxDatetimeComponent;
  let fixture: ComponentFixture<UxDatetimeComponent>;
  let formGroupDirectiveMock: any;
  beforeEach(
    waitForAsync(() => {
      formGroupDirectiveMock = { control: { get: () => null } };
      TestBed.configureTestingModule({
        declarations: [UxDatetimeComponent],
        imports: [TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: FormGroupDirective, useValue: formGroupDirectiveMock }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
