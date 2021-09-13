import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxStepProgressBarComponent } from './ux-step-progress-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

fdescribe('UxStepProgressBarComponent', () => {
  let component: UxStepProgressBarComponent;
  let fixture: ComponentFixture<UxStepProgressBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UxStepProgressBarComponent],

        imports: [IonicModule, HttpClientTestingModule],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UxStepProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the specified progress percentage displayed in width percentage', () => {
    component.progress = '40%';
    fixture.detectChanges();
    const progressBarEl = fixture.debugElement.query(By.css('.progress_bar__progress'));
    expect(progressBarEl.styles.width).toEqual('40%');
  });
});
