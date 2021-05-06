import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessPaxfulPage } from './success-paxful.page';

describe('SuccessPaxfulPage', () => {
  let component: SuccessPaxfulPage;
  let fixture: ComponentFixture<SuccessPaxfulPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessPaxfulPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessPaxfulPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
