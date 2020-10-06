import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInfoComponentComponent } from './client-info-component.component';

describe('ClientInfoComponentComponent', () => {
  let component: ClientInfoComponentComponent;
  let fixture: ComponentFixture<ClientInfoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInfoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInfoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
