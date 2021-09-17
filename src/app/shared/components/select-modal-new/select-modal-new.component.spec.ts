import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectModalNewComponent } from './select-modal-new.component';

describe('SelectModalNewComponent', () => {
  let component: SelectModalNewComponent;
  let fixture: ComponentFixture<SelectModalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectModalNewComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectModalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
