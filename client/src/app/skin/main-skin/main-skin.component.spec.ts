import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSkinComponent } from './main-skin.component';

describe('MainSkinComponent', () => {
  let component: MainSkinComponent;
  let fixture: ComponentFixture<MainSkinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSkinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
