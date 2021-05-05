import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperationsNewPaxfulPage } from './operations-new-paxful.page';

describe('OperationsNewPaxfulPage', () => {
  let component: OperationsNewPaxfulPage;
  let fixture: ComponentFixture<OperationsNewPaxfulPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OperationsNewPaxfulPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(OperationsNewPaxfulPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
