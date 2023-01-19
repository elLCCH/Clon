import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParalelosComponent } from './paralelos.component';

describe('ParalelosComponent', () => {
  let component: ParalelosComponent;
  let fixture: ComponentFixture<ParalelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParalelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParalelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
