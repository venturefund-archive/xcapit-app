import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowProfileComponent } from './show-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ShowProfileComponent', () => {
  let component: ShowProfileComponent;
  let fixture: ComponentFixture<ShowProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowProfileComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
