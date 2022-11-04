import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { UserRegisterContentComponent } from './user-register-content.component';

describe('UserRegisterContentComponent', () => {
  let component: UserRegisterContentComponent;
  let fixture: ComponentFixture<UserRegisterContentComponent>;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRegisterContentComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegisterContentComponent);
    component = fixture.componentInstance;
    component.status = 'COMPLETE'
    fixture.detectChanges();
  }));
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render properties when status is complete', () => {
    const titleElement =  fixture.debugElement.query(By.css('div[class="urc__title"] ion-text'));
    const [subtitleElement,subtitle2Element] =  fixture.debugElement.queryAll(By.css('div[class="urc__subtitle"] ion-text'));    
    expect(titleElement.nativeElement.innerHTML).toEqual('fiat_ramps.shared.user_register_content.complete.title');
    expect(subtitleElement.nativeElement.innerHTML).toEqual('fiat_ramps.shared.user_register_content.complete.subtitle')
    expect(subtitle2Element.nativeElement.innerHTML).toEqual('fiat_ramps.shared.user_register_content.complete.subtitle_2')    
  });
});
