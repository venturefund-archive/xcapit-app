import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ExplanationItemComponent } from './explanation-item.component';

describe('ExplanationItemComponent', () => {
  let component: ExplanationItemComponent;
  let fixture: ComponentFixture<ExplanationItemComponent>;
  let itemSpy : jasmine.SpyObj<any>;
  beforeEach(waitForAsync(() => {
      itemSpy = jasmine.createSpyObj('item',{}, {
        number:'testNumber',
        title: 'testTitle',
        icon: 'assets/img/testIcon',
        description:'testDescription'
      })
    TestBed.configureTestingModule({
      declarations: [ ExplanationItemComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplanationItemComponent);
    component = fixture.componentInstance;
    component.item = itemSpy; 
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const [numberEl, titleEl] = fixture.debugElement.queryAll(By.css('div.ei__title ion-text'));
    const iconEl = fixture.debugElement.query(By.css('.ei__item img'));
    const descriptionEl = fixture.debugElement.query(By.css('.ei__item ion-text'));

    expect(iconEl.attributes.src).toContain('assets/img/testIcon');
    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');
    expect(numberEl.nativeElement.innerHTML).toContain('testNumber');
    expect(descriptionEl.nativeElement.innerHTML).toContain('testDescription');
  });
});
