import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveMessageComponentComponent } from './remove-message-component.component';

describe('RemoveMessageComponentComponent', () => {
  let component: RemoveMessageComponentComponent;
  let fixture: ComponentFixture<RemoveMessageComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveMessageComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveMessageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
