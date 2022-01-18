import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxRadioItemComponent } from './ux-radio-item.component';

describe('UxRadioItemComponent', () => {
  let component: UxRadioItemComponent;
  let fixture: ComponentFixture<UxRadioItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UxRadioItemComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UxRadioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
