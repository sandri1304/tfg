import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInfoComponentComponent } from './message-info-component.component';

describe('MessageInfoComponentComponent', () => {
  let component: MessageInfoComponentComponent;
  let fixture: ComponentFixture<MessageInfoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageInfoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageInfoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
