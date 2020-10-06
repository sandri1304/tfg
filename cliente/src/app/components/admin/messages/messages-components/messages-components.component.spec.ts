import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponentsComponent } from './messages-components.component';

describe('MessagesComponentsComponent', () => {
  let component: MessagesComponentsComponent;
  let fixture: ComponentFixture<MessagesComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
