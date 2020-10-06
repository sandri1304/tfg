import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SumaryComponentComponent } from './sumary-component.component';

describe('SumaryComponentComponent', () => {
  let component: SumaryComponentComponent;
  let fixture: ComponentFixture<SumaryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SumaryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SumaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
