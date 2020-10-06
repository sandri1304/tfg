import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMessageComponentComponent } from './info-message-component.component';

describe('InfoMessageComponentComponent', () => {
  let component: InfoMessageComponentComponent;
  let fixture: ComponentFixture<InfoMessageComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMessageComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMessageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
