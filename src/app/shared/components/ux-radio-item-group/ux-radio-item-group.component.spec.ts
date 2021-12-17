import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxRadioItemGroupComponent } from './ux-radio-item-group.component';

describe('UxRadioItemGroupComponent', () => {
  let component: UxRadioItemGroupComponent;
  let fixture: ComponentFixture<UxRadioItemGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UxRadioItemGroupComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UxRadioItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
