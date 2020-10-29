import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxListInvertedComponent } from './ux-list-inverted.component';

describe('UxListInvertedComponent', () => {
  let component: UxListInvertedComponent;
  let fixture: ComponentFixture<UxListInvertedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxListInvertedComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UxListInvertedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
