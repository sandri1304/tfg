import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterIdUserComponent } from './register-id-user.component';

describe('RegisterIdUserComponent', () => {
  let component: RegisterIdUserComponent;
  let fixture: ComponentFixture<RegisterIdUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterIdUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterIdUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
