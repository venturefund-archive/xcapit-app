import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxRadioItemGroupComponent } from './ux-radio-item-group.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UxRadioItemGroupComponent', () => {
  let component: UxRadioItemGroupComponent;
  let fixture: ComponentFixture<UxRadioItemGroupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UxRadioItemGroupComponent],
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UxRadioItemGroupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
