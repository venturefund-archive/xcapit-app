import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessSubmodulesPage } from './success-submodules.page';

describe('SuccessSubmodulesPage', () => {
  let component: SuccessSubmodulesPage;
  let fixture: ComponentFixture<SuccessSubmodulesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessSubmodulesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessSubmodulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
